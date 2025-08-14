package com.ssafy.etch.search.listener;

import java.util.Map;

import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.document.Document;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.UpdateQuery;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.ssafy.etch.project.event.ProjectViewIncreasedEvent;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProjectViewCountSyncListener {

	private final ElasticsearchOperations operations;

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void on(ProjectViewIncreasedEvent event) {
		String script =
			"if (ctx._source.viewCount == null) { ctx._source.viewCount = 0; } " +
				"ctx._source.viewCount = Math.max(0, ctx._source.viewCount + params.delta);";

		Map<String, Object> params = Map.of("delta", event.delta());

		UpdateQuery uq = UpdateQuery.builder(event.projectId().toString())
			.withScript(script)
			.withParams(params)
			.withUpsert(Document.from(Map.of(
				"projectId", event.projectId(),
				"viewCount", Math.max(0, event.delta()) // 최초 없는 문서면 1
			)))
			.build();

		operations.update(uq, IndexCoordinates.of("project"));
	}
}

