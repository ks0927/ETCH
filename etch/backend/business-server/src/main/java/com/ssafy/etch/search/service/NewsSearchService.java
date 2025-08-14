package com.ssafy.etch.search.service;

import java.io.StringReader;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHitSupport;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import com.ssafy.etch.search.document.NewsDocument;
import com.ssafy.etch.search.dto.NewsSearchResponseDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsSearchService {

	private final ElasticsearchOperations elasticsearchOperations;

	public Page<NewsSearchResponseDTO> search(
		String keyword,
		int page,
		int size
	) {
		if (keyword == null || keyword.isBlank()) {
			return Page.empty();
		}

		// 기본 정렬: 최신 뉴스 우선, 동점 정렬 키는 newsId 오름차순
		Sort defaultSort = Sort.by(Sort.Order.desc("publishedAt"), Sort.Order.asc("newsId"));
		Pageable pageable = PageRequest.of(page, size);

		String jsonQuery = """
			{
			  "multi_match": {
			    "query": "%s",
			    "fields": ["title^2", "summary", "companyName"]
			  }
			}
			""".formatted(keyword);

		NativeQuery query = NativeQuery.builder()
			.withQuery(q -> q.withJson(new StringReader(jsonQuery)))
			.withPageable(pageable)        // ★ 페이지네이션
			.withTrackTotalHits(true)      // ★ 전체 개수 정확히 계산
			.build();

		SearchHits<NewsDocument> hits =
			elasticsearchOperations.search(query, NewsDocument.class);

		// Page<SearchHit<NewsDocument>> → Page<NewsSearchResponseDTO>
		return SearchHitSupport.searchPageFor(hits, pageable)
			.map(SearchHit::getContent)
			.map(NewsSearchResponseDTO::from);
	}
}
