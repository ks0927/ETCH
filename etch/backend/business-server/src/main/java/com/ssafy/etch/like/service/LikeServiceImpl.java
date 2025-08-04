package com.ssafy.etch.like.service;

import com.ssafy.etch.global.exception.CustomException;
import com.ssafy.etch.global.exception.ErrorCode;
import com.ssafy.etch.like.dto.LikeDTO;
import com.ssafy.etch.like.dto.LikeRequestDTO;
import com.ssafy.etch.like.entity.LikeEntity;
import com.ssafy.etch.like.entity.LikeType;
import com.ssafy.etch.like.repository.LikeRepository;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public void saveLike(Long memberId, LikeRequestDTO likeRequestDTO, LikeType likeType) {
        Long targetId = likeRequestDTO.getTargetId();
        if (targetId == null) {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        // 이미 좋아요한 경우 중복 방지 (선택)
        boolean exists = likeRepository.existsByMember_IdAndTargetIdAndType(memberId, targetId, likeType);
        if (exists) {
            throw new CustomException(ErrorCode.ALREADY_LIKED);
        }

        LikeDTO likeDTO = LikeDTO.builder()
                .memberId(memberId)
                .targetId(targetId)
                .type(likeType)
                .build();
        MemberEntity memberEntity = memberRepository.findById(memberId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        LikeEntity likeEntity = LikeEntity.from(likeDTO, memberEntity);

        likeRepository.save(likeEntity);
    }

    @Override
    @Transactional
    public void deleteLike(Long memberId, Long targetId, LikeType likeType) {
        if (targetId == null) {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        // 존재하는 좋아요 엔티티 조회
        LikeEntity likeEntity = likeRepository.findByMember_IdAndTargetIdAndType(memberId, targetId, likeType)
                .orElseThrow(() -> new CustomException(ErrorCode.LIKE_NOT_FOUND));

        likeRepository.delete(likeEntity);
    }
}
