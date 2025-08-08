package com.ssafy.etch.portfolio.service;

import com.ssafy.etch.global.exception.CustomException;
import com.ssafy.etch.global.exception.ErrorCode;
import com.ssafy.etch.member.repository.MemberRepository;
import com.ssafy.etch.portfolio.dto.PortfolioListResponseDTO;
import com.ssafy.etch.portfolio.entity.PortfolioEntity;
import com.ssafy.etch.portfolio.repository.PortfolioProjectRepository;
import com.ssafy.etch.portfolio.repository.PortfolioRepository;
import com.ssafy.etch.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final ProjectRepository projectRepository;
    private final PortfolioProjectRepository portfolioProjectRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public List<PortfolioListResponseDTO> getPortfolioList(Long memberId) {

        memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));



        return portfolioRepository.findAllByMember_Id(memberId)
                .stream()
                .map(PortfolioEntity::toPortfolioDTO)
                .map(PortfolioListResponseDTO::from)
                .toList();
    }


}
