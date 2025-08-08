package com.ssafy.etch.member.service;

import com.ssafy.etch.global.exception.CustomException;
import com.ssafy.etch.global.exception.ErrorCode;
import com.ssafy.etch.member.dto.MemberDTO;
import com.ssafy.etch.member.dto.MemberRequestDTO;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.member.repository.MemberRepository;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import com.ssafy.etch.project.dto.ProjectListDTO;
import com.ssafy.etch.project.entity.ProjectEntity;
import com.ssafy.etch.project.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final JWTUtil jwtUtil;

    @Override
    public MemberDTO findById(long id) {
        MemberEntity memberEntity = memberRepository.findById(id)
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        return memberEntity.toMemberDTO();
    }

    @Override
    @Transactional
    public MemberDTO registerNewMember(String email, MemberDTO memberDTO) {
        // role 설정
        memberDTO = memberDTO.toBuilder().role("USER").refreshToken("").email(email).build();
        MemberEntity memberEntity = MemberEntity.toMemberEntity(memberDTO);
        MemberEntity savedEntity = memberRepository.save(memberEntity);
        memberDTO = savedEntity.toMemberDTO();
        // refreshToken 생성
        String refreshToken = jwtUtil.createJwt(
                "refresh",
                memberDTO.getEmail(),
                memberDTO.getRole(),
                memberDTO.getId(),
                24 * 60 * 60 * 1000L // 1일
        );
        MemberEntity.updateRefreshToken(savedEntity, refreshToken);

        return savedEntity.toMemberDTO();
    }
    @Override
    @Transactional
    public void updateRefreshToken(Long id, String refreshToken) {
        MemberEntity memberEntity = memberRepository.findById(id)
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        MemberEntity.updateRefreshToken(memberEntity, refreshToken);
    }

    @Override
    @Transactional
    public void deleteMember(Long id) {
        MemberEntity memberEntity = memberRepository.findById(id)
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        MemberEntity.changeMemberStatus(memberEntity, true);
    }

    @Override
    @Transactional
    public MemberDTO updateMember(Long id, MemberRequestDTO memberRequestDTO) {
        MemberEntity memberEntity = memberRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        MemberEntity.updateMemberInfo(memberEntity, memberRequestDTO);

        return memberEntity.toMemberDTO();
    }

    @Override
    public List<ProjectListDTO> findAllProjectByMemberId(Long memberId) {
        return projectRepository.findAllByMemberId(memberId)
                .stream()
                .map(ProjectEntity::toProjectDTO)
                .map(ProjectListDTO::from)
                .toList();
    }
}
