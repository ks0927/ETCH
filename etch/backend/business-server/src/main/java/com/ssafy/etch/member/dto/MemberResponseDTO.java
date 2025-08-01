package com.ssafy.etch.member.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MemberResponseDTO {
    private Long id;
    private String email;
    private String nickname;
    private String profile;
}
