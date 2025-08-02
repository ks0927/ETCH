package com.ssafy.etch.member.service;

import com.ssafy.etch.global.exception.CustomException;
import com.ssafy.etch.global.exception.ErrorCode;
import com.ssafy.etch.member.dto.MemberDTO;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.member.entity.MemberRole;
import com.ssafy.etch.member.repository.MemberRepository;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final JWTUtil jwtUtil;

    @Override
    public MemberDTO findById(long id) {
        MemberEntity memberEntity = memberRepository.findById(id)
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        return memberEntity.toMemberDTO();
    }

    @Override
    @Transactional
    public MemberDTO registerNewMember(MemberDTO memberDTO) {
        // refreshToken 생성
        String refreshToken = jwtUtil.createJwt(
                "refresh",
                memberDTO.getEmail(),
                memberDTO.getRole(),
                memberDTO.getId(),
                24 * 60 * 60 * 1000L // 1일
        );
        // role 설정
        memberDTO.setRole("USER");
        memberDTO.setRefreshToken(refreshToken);
        MemberEntity memberEntity = MemberEntity.toMemberEntity(memberDTO);
        MemberEntity saved = memberRepository.save(memberEntity);
        return saved.toMemberDTO();
    }
    @Override
    @Transactional
    public void updateRefreshToken(Long id, String refreshToken) {
        MemberEntity memberEntity = memberRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

        MemberEntity.updateRefreshToken(memberEntity, refreshToken);
    }

}
