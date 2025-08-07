package com.ssafy.etch.coverLetter.service;

import com.ssafy.etch.coverLetter.dto.CoverLetterListResponseDTO;
import com.ssafy.etch.coverLetter.entity.CoverLetterEntity;
import com.ssafy.etch.coverLetter.repository.CoverLetterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoverLetterServiceImpl implements CoverLetterService {

    private final CoverLetterRepository coverLetterRepository;

    @Override
    public List<CoverLetterListResponseDTO> getCoverLetterlist(Long memberId) {
        return coverLetterRepository.findAllByMemberId(memberId)
                .stream()
                .map(CoverLetterEntity::toCoverLetterDTO)
                .map(CoverLetterListResponseDTO::from)
                .toList();
    }
}
