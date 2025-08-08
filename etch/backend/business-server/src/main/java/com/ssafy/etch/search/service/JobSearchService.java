package com.ssafy.etch.search.service;

import java.io.StringReader;
import java.util.List;

import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import com.ssafy.etch.search.document.JobDocument;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobSearchService {

	private final ElasticsearchOperations elasticsearchOperations;

	public List<JobDocument> searchWithFilters(
		String keyword,
		List<String> regions,
		List<String> jobCategories,
		String workType,
		String educationLevel
	) {
		String jsonQuery = buildJsonQuery(keyword, regions, jobCategories, workType, educationLevel);

		if (jsonQuery == null) {
			// 검색어도 없고 필터도 없으면 빈 결과
			return List.of();
		}

		NativeQuery query = NativeQuery.builder()
			.withQuery(q -> q.withJson(new StringReader(jsonQuery)))
			.build();

		SearchHits<JobDocument> hits =
			elasticsearchOperations.search(query, JobDocument.class);

		return hits.getSearchHits().stream()
			.map(SearchHit::getContent)
			.toList();
	}

	private String buildJsonQuery(String keyword,
		List<String> regions,
		List<String> jobCategories,
		String workType,
		String educationLevel) {

		// 모든 조건이 비어 있으면 검색 안 함
		boolean noKeyword = (keyword == null || keyword.isBlank());
		boolean noFilters = (isEmpty(regions) && isEmpty(jobCategories) && workType == null && educationLevel == null);

		if (noKeyword && noFilters) {
			return null; // 검색 안 함
		}

		StringBuilder filter = new StringBuilder();

		if (!isEmpty(regions)) {
			filter.append("""
				{ "terms": { "regions": %s } },
				""".formatted(toJsonArray(regions)));
		}
		if (!isEmpty(jobCategories)) {
			filter.append("""
				{ "terms": { "jobCategories": %s } },
				""".formatted(toJsonArray(jobCategories)));
		}
		if (workType != null && !workType.isBlank()) {
			filter.append("""
				{ "term": { "workType": "%s" } },
				""".formatted(workType));
		}
		if (educationLevel != null && !educationLevel.isBlank()) {
			filter.append("""
				{ "term": { "educationLevel": "%s" } },
				""".formatted(educationLevel));
		}

		if (noKeyword) {
			// 필터만 있는 경우
			return """
				{
				  "bool": {
				    "filter": [
				      %s
				    ]
				  }
				}
				""".formatted(trimTrailingComma(filter.toString()));
		} else {
			// 키워드 + 필터 조합
			return """
				{
				  "bool": {
				    "must": [
				      {
				        "multi_match": {
				          "query": "%s",
				          "fields": ["title", "companyName", "regions", "jobCategories"]
				        }
				      }
				    ],
				    "filter": [
				      %s
				    ]
				  }
				}
				""".formatted(keyword, trimTrailingComma(filter.toString()));
		}
	}

	private boolean isEmpty(List<?> list) {
		return list == null || list.isEmpty();
	}

	private String toJsonArray(List<String> values) {
		return "[" + values.stream().map(v -> "\"" + v + "\"").reduce((a, b) -> a + "," + b).orElse("") + "]";
	}

	private String trimTrailingComma(String s) {
		return s.endsWith(",\n") ? s.substring(0, s.length() - 2) : s;
	}
}