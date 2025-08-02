package com.ssafy.etch.member.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MemberRequestDTO {
    private String nickname;
    private String phoneNumber;
    private String profile;
}
