package com.ssafy.etch.coverLetter.service;

import com.ssafy.etch.coverLetter.dto.CoverLetterDTO;
import com.ssafy.etch.coverLetter.dto.CoverLetterListResponseDTO;
import com.ssafy.etch.coverLetter.dto.CoverLetterRequestDTO;
import com.ssafy.etch.coverLetter.entity.CoverLetterEntity;
import com.ssafy.etch.coverLetter.repository.CoverLetterRepository;
import com.ssafy.etch.global.exception.CustomException;
import com.ssafy.etch.global.exception.ErrorCode;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.member.repository.MemberRepository;
import jakarta.persistence.Table;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoverLetterServiceImpl implements CoverLetterService {

    private final CoverLetterRepository coverLetterRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<CoverLetterListResponseDTO> getCoverLetterlist(Long memberId) {
        return coverLetterRepository.findAllByMemberId(memberId)
                .stream()
                .map(CoverLetterEntity::toCoverLetterDTO)
                .map(CoverLetterListResponseDTO::from)
                .toList();
    }

    @Override
    @Transactional
    public void saveCoverLetter(Long memberId, CoverLetterRequestDTO coverLetterRequestDTO) {
        MemberEntity memberEntity = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        CoverLetterDTO coverLetterDTO = coverLetterRequestDTO.toCoverLetterDTO()
                .toBuilder()
                .member(memberEntity)
                .build();
        CoverLetterEntity entity = CoverLetterEntity.from(coverLetterDTO);

        coverLetterRepository.save(entity);
    }
}
