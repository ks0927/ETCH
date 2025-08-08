package com.ssafy.etch.news.service;

import java.util.List;

import com.ssafy.etch.news.dto.CompanyNewsDTO;
import com.ssafy.etch.news.dto.LatestNewsDTO;
import com.ssafy.etch.news.dto.TopCompanyDTO;

public interface NewsService {
	List<LatestNewsDTO> getLatestNews();
	List<CompanyNewsDTO> getNewsByCompanyId(Long companyId);
	List<TopCompanyDTO> getTopCompaniesFromRedis();
}
