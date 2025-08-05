package com.ssafy.etch.like.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class LikeRequestDTO {
    private Long targetId;
}
