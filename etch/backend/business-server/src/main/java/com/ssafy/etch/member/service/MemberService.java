package com.ssafy.etch.member.service;

import com.ssafy.etch.member.dto.MemberDTO;
import com.ssafy.etch.member.dto.MemberRequestDTO;
import com.ssafy.etch.project.dto.ProjectListDTO;

import java.util.List;

public interface MemberService {
    MemberDTO findById(long id);

    MemberDTO registerNewMember(String email, MemberDTO memberDTO);

    void updateRefreshToken(Long id, String refreshToken);

    void deleteMember(Long id);

    MemberDTO updateMember(Long id, MemberRequestDTO memberRequestDTO);

    List<ProjectListDTO> findAllProjectByMemberId(Long memberId);
}
