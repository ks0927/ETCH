package com.ssafy.etch.news.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.etch.news.dto.LatestNewsDTO;
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
							.map(LatestNewsDTO::new)
							.toList();
	}

}
