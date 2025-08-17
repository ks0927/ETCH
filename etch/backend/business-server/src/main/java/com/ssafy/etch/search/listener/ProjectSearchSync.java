package com.ssafy.etch.search.listener;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.ssafy.etch.project.event.ProjectChangedEvent;
import com.ssafy.etch.project.repository.ProjectRepository;
import com.ssafy.etch.search.document.ProjectDocument;
import com.ssafy.etch.search.repository.ProjectDocumentRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProjectSearchSync {

	private final ProjectRepository projectRepository;       // DB에서 최신 상태를 읽는다
	private final ProjectDocumentRepository projectDocumentRepository; // ES 반영

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void onChanged(ProjectChangedEvent evt) {
		if (evt.type() == ProjectChangedEvent.ChangeType.DELETE) {
			// 여러 번 와도 안전 (멱등)
			projectDocumentRepository.deleteById(evt.projectId());
			return;
		}
		// UPSERT: 현재 DB 상태를 읽어 ES에 upsert (save = upsert → 멱등)
		projectRepository.findById(evt.projectId()).ifPresentOrElse(e -> {
			boolean visible = Boolean.TRUE.equals(e.getIsPublic())
				&& !Boolean.TRUE.equals(e.getIsDeleted());
			if (visible) {
				// 공개: 색인(업서트 → 멱등)
				ProjectDocument doc = ProjectDocument.from(e);
				projectDocumentRepository.save(doc);
			} else {
				// 비공개/삭제됨: ES에서 제거(여러 번 호출돼도 안전)
				projectDocumentRepository.deleteById(e.getId());
			}
		}, () -> projectDocumentRepository.deleteById(evt.projectId()));
	}
}

