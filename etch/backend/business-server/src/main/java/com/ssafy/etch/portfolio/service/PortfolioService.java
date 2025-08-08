package com.ssafy.etch.portfolio.service;

import com.ssafy.etch.portfolio.dto.PortfolioListResponseDTO;
import com.ssafy.etch.portfolio.dto.PortfolioRequestDTO;

import java.util.List;

public interface PortfolioService {
    List<PortfolioListResponseDTO> getPortfolioList(Long memberId);
    void savePortfolio(Long memberId, PortfolioRequestDTO portfolioRequestDTO);
}
