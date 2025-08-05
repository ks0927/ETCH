package com.ssafy.etch.news.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.etch.news.dto.CompanyNewsDTO;
import com.ssafy.etch.news.dto.LatestNewsDTO;
import com.ssafy.etch.news.entity.NewsEntity;
import com.ssafy.etch.news.repository.NewsRepository;

@Service
public class NewsService {
	private final NewsRepository newsRepository;

	public NewsService(NewsRepository newsRepository) {
		this.newsRepository = newsRepository;
	}

	public List<LatestNewsDTO> getLatestNews() {
		return newsRepository.findAllByOrderByPublishedAtDesc()
			.stream()
			.map(NewsEntity::toNewsDTO)
			.map(LatestNewsDTO::from)
			.toList();
	}

	public List<CompanyNewsDTO> getNewsByCompanyId(Long companyId) {
		return newsRepository.findAllByCompanyIdOrderByPublishedAtDesc(companyId)
			.stream()
			.map(NewsEntity::toNewsDTO)
			.map(CompanyNewsDTO::from)
			.toList();
	}

}
