package com.ssafy.etch.search.service;

import java.io.StringReader;
import java.util.List;

import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import com.ssafy.etch.search.document.ProjectDocument;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectSearchService {

	private final ElasticsearchOperations elasticsearchOperations;

	public List<ProjectDocument> search(String keyword) {
		if (keyword == null || keyword.isBlank()) {
			return List.of(); // 검색어 없으면 빈 리스트 반환
		}

		String jsonQuery = """
			    {
			      "multi_match": {
			        "query": "%s",
			        "fields": ["title", "content"]
			      }
			    }
			""".formatted(keyword);

		NativeQuery query = NativeQuery.builder()
			.withQuery(q -> q.withJson(new StringReader(jsonQuery)))
			.build();

		SearchHits<ProjectDocument> hits =
			elasticsearchOperations.search(query, ProjectDocument.class);

		return hits.getSearchHits().stream()
			.map(SearchHit::getContent)
			.toList();
	}
}

