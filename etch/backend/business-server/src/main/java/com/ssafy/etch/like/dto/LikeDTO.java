package com.ssafy.etch.like.dto;

import com.ssafy.etch.like.entity.LikeType;
import com.ssafy.etch.member.entity.MemberRole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class LikeDTO {
    private Long id;
    private Long memberId;
    private Long targetId;
    private LikeType type;
}
