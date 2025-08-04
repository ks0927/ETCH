package com.ssafy.etch.like.repository;

import com.ssafy.etch.like.entity.LikeEntity;
import com.ssafy.etch.like.entity.LikeType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    boolean existsByMember_IdAndTargetIdAndType(Long memberId, Long targetId, LikeType type);
}