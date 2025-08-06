package com.ssafy.etch.news.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.ssafy.etch.news.dto.CompanyNewsDTO;
import com.ssafy.etch.news.dto.LatestNewsDTO;
import com.ssafy.etch.news.dto.TopCompanyDTO;
import com.ssafy.etch.news.entity.NewsEntity;
import com.ssafy.etch.news.repository.NewsRepository;

@Service
public class NewsServiceImpl implements NewsService {

	private final NewsRepository newsRepository;
	private final RedisTemplate<String, Object> redisTemplate;

	public NewsServiceImpl(NewsRepository newsRepository, RedisTemplate<String, Object> redisTemplate) {
		this.newsRepository = newsRepository;
		this.redisTemplate = redisTemplate;
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

	@Override
	public List<TopCompanyDTO> getTopCompaniesFromRedis() {
		List<Object> keys = redisTemplate.opsForList().range("top10_companies", 0, -1);
		if (keys == null) return Collections.emptyList();

		List<TopCompanyDTO> result = new ArrayList<>();
		int rank = 1;

		for (Object key : keys) {
			Map<Object, Object> map = redisTemplate.opsForHash().entries((String)key);
			if (map.isEmpty()) continue;

			TopCompanyDTO dto = TopCompanyDTO.builder()
				.companyId(Long.valueOf((String) map.get("company_id")))
				.companyName((String) map.get("company_name"))
				.likeCount(Long.valueOf((String) map.get("likes")))
				.articleCount(Long.valueOf((String) map.get("article_count")))
				.rank(rank++)
				.build();

			result.add(dto);
		}

		return result;
	}

}
