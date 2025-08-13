package com.ssafy.etch.search.service;

import java.io.StringReader;
import java.util.List;

import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import com.ssafy.etch.search.document.NewsDocument;
import com.ssafy.etch.search.dto.NewsSearchResponseDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsSearchService {

	private final ElasticsearchOperations elasticsearchOperations;

	public List<NewsSearchResponseDTO> search(String keyword) {
		if (keyword == null || keyword.isBlank()) {
			return List.of(); // 검색어 없으면 빈 결과
		}

		String jsonQuery = """
			{
			  "multi_match": {
			    "query": "%s",
			    "fields": ["title", "summary", "companyName"]
			  }
			}
			""".formatted(keyword);

		NativeQuery query = NativeQuery.builder()
			.withQuery(q -> q.withJson(new StringReader(jsonQuery)))
			.build();

		SearchHits<NewsDocument> hits = elasticsearchOperations.search(query, NewsDocument.class);

		return hits.getSearchHits().stream()
			.map(SearchHit::getContent).map(NewsSearchResponseDTO::from)
			.toList();
	}
}
