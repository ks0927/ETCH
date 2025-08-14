package com.ssafy.etch.search.service;

import java.io.StringReader;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHitSupport;
import org.springframework.stereotype.Service;

import com.ssafy.etch.search.document.JobDocument;
import com.ssafy.etch.search.dto.JobSearchResponseDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobSearchService {

	private final ElasticsearchOperations elasticsearchOperations;

	public Page<JobSearchResponseDTO> searchWithFilters(
		String keyword,
		List<String> regions,
		List<String> jobCategories,
		String workType,
		String educationLevel,
		int page,
		int size
	) {
		String jsonQuery = buildJsonQuery(keyword, regions, jobCategories, workType, educationLevel);

		if (jsonQuery == null) {
			return Page.empty();
		}

		Pageable pageable = PageRequest.of(page, size);

		NativeQuery query = NativeQuery.builder()
			.withQuery(q -> q.withJson(new StringReader(jsonQuery)))
			.withPageable(pageable)
			.withTrackTotalHits(true) // 전체 개수 추적
			.build();

		var hits = elasticsearchOperations.search(query, JobDocument.class);

		// ES 결과 -> Page<JobSearchResponseDTO>
		return SearchHitSupport.searchPageFor(hits, pageable)
			.map(SearchHit::getContent)                  // JobDocument
			.map(JobSearchResponseDTO::from);            // DTO 변환
	}

	private String buildJsonQuery(
		String keyword,
		List<String> regions,
		List<String> jobCategories,
		String workType,
		String educationLevel
	) {
		boolean noKeyword = (keyword == null || keyword.isBlank());
		boolean noFilters = (isEmpty(regions) && isEmpty(jobCategories) && workType == null && educationLevel == null);

		if (noKeyword && noFilters) {
			return null;
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
		return "[" + values.stream()
			.map(v -> "\"" + v + "\"")
			.reduce((a, b) -> a + "," + b)
			.orElse("") + "]";
	}

	private String trimTrailingComma(String s) {
		return s.endsWith(",\n") ? s.substring(0, s.length() - 2) : s;
	}
}
