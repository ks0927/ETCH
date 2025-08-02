package com.ssafy.etch.member.service;

import com.ssafy.etch.member.dto.MemberDTO;

public interface MemberService {
    MemberDTO findById(long id);

    MemberDTO registerNewMember(MemberDTO memberDTO);

    void updateRefreshToken(Long id, String refreshToken);
}
