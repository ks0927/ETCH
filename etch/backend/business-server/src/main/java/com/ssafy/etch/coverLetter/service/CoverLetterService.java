package com.ssafy.etch.coverLetter.service;

import com.ssafy.etch.coverLetter.dto.CoverLetterListResponseDTO;

import java.util.List;

public interface CoverLetterService {
    List<CoverLetterListResponseDTO> getCoverLetterlist(Long memberId);
}
