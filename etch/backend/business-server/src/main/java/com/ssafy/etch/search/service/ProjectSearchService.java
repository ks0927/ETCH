package com.ssafy.etch.search.service;

import java.io.StringReader;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import com.ssafy.etch.search.document.ProjectDocument;
import com.ssafy.etch.search.dto.ProjectSearchResponseDTO;
import com.ssafy.etch.search.enumeration.ProjectSort;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectSearchService {

	private final ElasticsearchOperations elasticsearchOperations;

	public List<ProjectSearchResponseDTO> search(
		@Nullable String keyword,
		@Nullable String projectCategory,            // enum name 문자열 (예: "BACKEND")
		@Nullable ProjectSort sortOpt) {

		// 0) 키워드/필터 둘 다 없으면 빈 리스트
		boolean hasKeyword = keyword != null && !keyword.isBlank();
		boolean hasCategory = projectCategory != null && !projectCategory.isBlank();
		if (!hasKeyword && !hasCategory)
			return List.of();

		// 1) must 절
		String mustClause = hasKeyword
			? """
			{ "multi_match": {
			    "query": %s,
			    "fields": ["title^3", "memberName^2", "projectTechs"],
			    "type": "best_fields",
			    "operator": "or"
			  }}
			""".formatted(toJsonString(keyword))
			: "{ \"match_all\": {} }";

		// 2) filter 절 (카테고리 있을 때만)
		String filterClause = hasCategory
			? """
			, "filter": [
			    { "term": { "projectCategory": %s } }
			  ]
			""".formatted(toJsonString(projectCategory))
			: "";

		String jsonQuery = """
			{ "bool": {
			    "must": [ %s ]
			    %s
			}}
			""".formatted(mustClause, filterClause);

		// 3) 정렬 (기본 최신순)
		ProjectSort sort = (sortOpt == null) ? ProjectSort.LATEST : sortOpt;

		var builder = NativeQuery.builder()
			.withQuery(q -> q.withJson(new StringReader(jsonQuery)));

		// ✅ Spring Data Sort 사용 (import org.springframework.data.domain.Sort)
		switch (sort) {
			case VIEWS -> {
				builder.withSort(Sort.by(Sort.Order.desc("viewCount")));
				builder.withSort(Sort.by(Sort.Order.desc("createdAt"))); // 동점 타이브레이커
			}
			case LIKES -> {
				builder.withSort(Sort.by(Sort.Order.desc("likeCount")));
				builder.withSort(Sort.by(Sort.Order.desc("createdAt")));
			}
			case LATEST -> {
				builder.withSort(Sort.by(Sort.Order.desc("createdAt")));
			}
		}

		NativeQuery query = builder.build();

		SearchHits<ProjectDocument> hits =
			elasticsearchOperations.search(query, ProjectDocument.class);

		return hits.getSearchHits().stream()
			.map(SearchHit::getContent).map(ProjectSearchResponseDTO::from)
			.toList();
	}

	// 따옴표/역슬래시만 간단 이스케이프
	private static String toJsonString(String s) {
		return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
	}
}


