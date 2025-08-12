package com.ssafy.etch.news.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.ssafy.etch.news.dto.CompanyNewsDTO;
import com.ssafy.etch.news.dto.LatestNewsDTO;
import com.ssafy.etch.news.dto.RecommendNewsDTO;
import com.ssafy.etch.news.dto.TopCompanyDTO;
import com.ssafy.etch.news.entity.NewsEntity;
import com.ssafy.etch.news.repository.NewsRepository;
import com.ssafy.etch.project.repository.ProjectRepository;

@Service
public class NewsServiceImpl implements NewsService {

	private final NewsRepository newsRepository;
	private final RedisTemplate<String, Object> redisTemplate;

	private static final int MAX_PAGE_SIZE = 10;
	private final ProjectRepository projectRepository;

	public NewsServiceImpl(NewsRepository newsRepository, RedisTemplate<String, Object> redisTemplate,
		ProjectRepository projectRepository) {
		this.newsRepository = newsRepository;
		this.redisTemplate = redisTemplate;
		this.projectRepository = projectRepository;
	}

	@Override
	public List<LatestNewsDTO> getLatestNews(int page, int pageSize) {
		final int pageIndex = Math.max(0, page - 1);
		final int size = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);

		Pageable pageable = PageRequest.of(pageIndex, size);

		return newsRepository.findAllByOrderByPublishedAtDesc(pageable)
			.stream()
			.map(NewsEntity::toNewsDTO)
			.map(LatestNewsDTO::from)
			.toList();
	}

	@Override
	public List<CompanyNewsDTO> getNewsByCompanyId(Long companyId, int page, int pageSize) {
		final int pageIndex = Math.max(0, page - 1);
		final int size = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);

		Pageable pageable = PageRequest.of(pageIndex, size);

		return newsRepository.findAllByCompanyIdOrderByPublishedAtDesc(companyId, pageable)
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

	/**
	 * redis에서 기사 ID 목록 가져와서,
	 * 이 ID들을 DB에서 조회하고,
	 * 기사 정보들 가져와서 프론트로 던져줌
	 */
	@Override
	public List<RecommendNewsDTO> getRecommendNewsFromRedis(Long userId) {
		// userId로 redis에서 추천 기사ID 목록 조회
		String redisKey = "recommendations_data_user_" + userId;
		List<Object> recommendedIdObject = redisTemplate.opsForList().range(redisKey, 0, -1);

		if (recommendedIdObject == null || recommendedIdObject.isEmpty()) return Collections.emptyList();

		// 조회된 Id 목록을 Long 타입 리스트로 변환
		List<Long> recommendedIds = recommendedIdObject.stream()
			.map(obj -> Long.valueOf(String.valueOf(obj)))
			.collect(Collectors.toList());

		// Id 리스트를 통해 DB에서 뉴스 데이터 조회
		Map<Long, NewsEntity> newsEntityMap = newsRepository.findAllById(recommendedIds).stream()
			.collect(Collectors.toMap(NewsEntity::getId, Function.identity()));

		// NewsEntity -> RecommendNewsDTO 반환
		List<RecommendNewsDTO> result = recommendedIds.stream()
			.map(newsEntityMap::get) // Map에서 NewsEntity 찾기
			.filter(java.util.Objects::nonNull) // DB에 없는 ID가 있을 경우를 대비해 null 체크
			.map(newsEntity -> RecommendNewsDTO.builder() // DTO로 변환
				.id(newsEntity.getId())
				.thumbnailUrl(newsEntity.getThumbnailUrl())
				.title(newsEntity.getTitle())
				.description(newsEntity.getDescription())
				.url(newsEntity.getUrl())
				.publishedAt(newsEntity.getPublishedAt())
				.build())
			.collect(Collectors.toList());

		return result;
	}
}
