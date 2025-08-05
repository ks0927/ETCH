package com.ssafy.etch.news.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.etch.news.dto.CompanyNewsDTO;
import com.ssafy.etch.news.dto.LatestNewsDTO;
import com.ssafy.etch.news.entity.NewsEntity;
import com.ssafy.etch.news.repository.NewsRepository;

@Service
public class NewsServiceImpl implements NewsService {

	private final NewsRepository newsRepository;

	public NewsServiceImpl(NewsRepository newsRepository) {
		this.newsRepository = newsRepository;
	}

	@Override
	public List<LatestNewsDTO> getLatestNews() {
		return newsRepository.findAllByOrderByPublishedAtDesc()
			.stream()
			.map(NewsEntity::toNewsDTO)
			.map(LatestNewsDTO::from)
			.toList();
	}

	@Override
	public List<CompanyNewsDTO> getNewsByCompanyId(Long companyId) {
		return newsRepository.findAllByCompanyIdOrderByPublishedAtDesc(companyId)
			.stream()
			.map(NewsEntity::toNewsDTO)
			.map(CompanyNewsDTO::from)
			.toList();
	}

}
