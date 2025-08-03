package com.ssafy.etch.company.service;

import java.util.List;

import com.ssafy.etch.company.dto.CompanyRankingDTO;

public interface CompanyService {
	List<CompanyRankingDTO> getTop10();
}
