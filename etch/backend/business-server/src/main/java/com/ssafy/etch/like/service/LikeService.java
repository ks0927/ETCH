package com.ssafy.etch.like.service;

import com.ssafy.etch.like.dto.LikeRequestDTO;
import com.ssafy.etch.like.entity.LikeType;

public interface LikeService {
    void saveLike(Long memberId, LikeRequestDTO likeRequestDTO, LikeType likeType);
    void deleteLike(Long memberId, Long targetId, LikeType likeType);
}
