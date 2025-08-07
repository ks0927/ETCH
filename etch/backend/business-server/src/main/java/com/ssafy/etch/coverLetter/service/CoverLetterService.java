package com.ssafy.etch.coverLetter.service;

import com.ssafy.etch.coverLetter.dto.CoverLetterListResponseDTO;
import com.ssafy.etch.coverLetter.dto.CoverLetterRequestDTO;

import java.util.List;

public interface CoverLetterService {
    List<CoverLetterListResponseDTO> getCoverLetterlist(Long memberId);
    void saveCoverLetter(Long memberId, CoverLetterRequestDTO coverLetterRequestDTO);
}
