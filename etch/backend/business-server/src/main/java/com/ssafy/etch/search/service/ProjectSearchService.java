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

	public Page<ProjectSearchResponseDTO> search(
		@Nullable String keyword,
		@Nullable String projectCategory,    // enum name 문자열 (예: "BACKEND")
		@Nullable ProjectSort sortOpt,
		int page,
		int size
	) {
		boolean hasKeyword = keyword != null && !keyword.isBlank();
		boolean hasCategory = projectCategory != null && !projectCategory.isBlank();
		if (!hasKeyword && !hasCategory)
			return Page.empty();

		// 1) must / filter
		String mustClause = hasKeyword
			? """
			{ "multi_match": {
			    "query": %s,
			    "fields": ["title^3","memberName^2","projectTechs"],
			    "type": "best_fields",
			    "operator": "or"
			  } }
			""".formatted(toJsonString(keyword))
			: "{ \"match_all\": {} }";

		String filterClause = hasCategory
			? """
			, "filter": [ { "term": { "projectCategory": %s } } ]
			""".formatted(toJsonString(projectCategory))
			: "";

		String jsonQuery = """
			{ "bool": {
			    "must": [ %s ]
			    %s
			} }
			""".formatted(mustClause, filterClause);

		// 2) Pageable + Sort
		ProjectSort sort = (sortOpt == null) ? ProjectSort.LATEST : sortOpt;
		Sort sortSpec = switch (sort) {
			case VIEWS -> Sort.by(Sort.Order.desc("viewCount"), Sort.Order.desc("createdAt"));
			case LIKES -> Sort.by(Sort.Order.desc("likeCount"), Sort.Order.desc("createdAt"));
			case LATEST -> Sort.by(Sort.Order.desc("createdAt"));
		};
		Pageable pageable = PageRequest.of(page, size, sortSpec);

		// 3) NativeQuery (track_total_hits 켜기)
		NativeQuery query = NativeQuery.builder()
			.withQuery(q -> q.withJson(new StringReader(jsonQuery)))
			.withPageable(pageable)
			.withTrackTotalHits(true)
			.build();

		// 4) 실행 + Page<ProjectSearchResponseDTO> 변환
		SearchHits<ProjectDocument> hits = elasticsearchOperations.search(query, ProjectDocument.class);
		return SearchHitSupport.searchPageFor(hits, pageable)
			.map(SearchHit::getContent)
			.map(ProjectSearchResponseDTO::from);
	}

	// 따옴표/역슬래시 간단 이스케이프
	private static String toJsonString(String s) {
		return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
	}
}



