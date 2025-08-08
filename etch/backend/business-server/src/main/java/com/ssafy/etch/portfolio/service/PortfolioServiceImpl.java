package com.ssafy.etch.portfolio.service;

import com.ssafy.etch.global.exception.CustomException;
import com.ssafy.etch.global.exception.ErrorCode;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.member.repository.MemberRepository;
import com.ssafy.etch.portfolio.dto.PortfolioDTO;
import com.ssafy.etch.portfolio.dto.PortfolioListResponseDTO;
import com.ssafy.etch.portfolio.dto.PortfolioRequestDTO;
import com.ssafy.etch.portfolio.entity.PortfolioEntity;
import com.ssafy.etch.portfolio.entity.PortfolioProjectEntity;
import com.ssafy.etch.portfolio.repository.PortfolioProjectRepository;
import com.ssafy.etch.portfolio.repository.PortfolioRepository;
import com.ssafy.etch.project.entity.ProjectEntity;
import com.ssafy.etch.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    @Override
    @Transactional
    public void savePortfolio(Long memberId, PortfolioRequestDTO portfolioRequestDTO) {
        MemberEntity memberEntity = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        PortfolioDTO portfolioDTO = portfolioRequestDTO.toPortfolioDTO().toBuilder().member(memberEntity).build();
        PortfolioEntity savedPortfolio = portfolioRepository.save(PortfolioEntity.from(portfolioDTO));
        List<Long> projectIds = portfolioRequestDTO.getProjectIds();
        List<PortfolioProjectEntity> savedEntities = new ArrayList<>();

        for (Long projectId : projectIds) {
            ProjectEntity projectEntity = projectRepository.findById(projectId).orElseThrow(()-> new CustomException(ErrorCode.CONTENT_NOT_FOUND));

            PortfolioProjectEntity entity = PortfolioProjectEntity.builder()
                    .portfolio(savedPortfolio)
                    .project(projectEntity)
                    .build();
            PortfolioProjectEntity saved = portfolioProjectRepository.save(entity);
            savedEntities.add(saved);
        }
        PortfolioEntity.updateInfo(savedPortfolio, savedEntities);
    }

}
