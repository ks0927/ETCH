package com.ssafy.etch.portfolio.service;

import com.ssafy.etch.portfolio.dto.PortfolioListResponseDTO;

import java.util.List;

public interface PortfolioService {
    List<PortfolioListResponseDTO> getPortfolioList(Long memberId);

}
