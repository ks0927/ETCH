package com.ssafy.etch.search.listener;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.ssafy.etch.project.event.ProjectViewCountChangedEvent;
import com.ssafy.etch.project.repository.ProjectRepository;
import com.ssafy.etch.search.document.ProjectDocument;
import com.ssafy.etch.search.repository.ProjectDocumentRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProjectViewCountSync {

	private final ProjectRepository projectRepository;
	private final ProjectDocumentRepository projectDocumentRepository;

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void onViewChanged(ProjectViewCountChangedEvent evt) {
		projectRepository.findById(evt.projectId()).ifPresentOrElse(e -> {
			boolean visible = Boolean.TRUE.equals(e.getIsPublic())
				&& !Boolean.TRUE.equals(e.getIsDeleted());

			if (visible) {
				// DB를 진실로 삼아 전체 도큐먼트 업서트 (viewCount 포함)
				ProjectDocument doc = ProjectDocument.from(e);
				projectDocumentRepository.save(doc);
			} else {
				projectDocumentRepository.deleteById(e.getId());
			}
		}, () -> projectDocumentRepository.deleteById(evt.projectId()));
	}
}

