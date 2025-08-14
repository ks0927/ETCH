package com.ssafy.etch.search.listener;

import java.util.Map;

import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.document.Document;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.UpdateQuery;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.ssafy.etch.project.event.ProjectLikeChangedEvent;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProjectLikeCountSyncListener {

	private final ElasticsearchOperations operations;

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void on(ProjectLikeChangedEvent event) {
		String script =
			"if (ctx._source.likeCount == null) { ctx._source.likeCount = 0; } " +
				"ctx._source.likeCount = Math.max(0, ctx._source.likeCount + params.delta);";

		Map<String, Object> params = Map.of("delta", event.delta());

		UpdateQuery uq = UpdateQuery.builder(event.projectId().toString())
			.withScript(script)
			.withParams(params)
			// 문서가 없을 때 upsert(최초 값 세팅)
			.withUpsert(Document.from(Map.of(
				"projectId", event.projectId(),   // ES 문서에 PK 보관(선택)
				"likeCount", Math.max(0, event.delta()) // 최초 like 시 1, unlike만 오면 0
			)))
			.build();

		operations.update(uq, IndexCoordinates.of("project"));
	}
}

