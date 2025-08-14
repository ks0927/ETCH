package com.ssafy.etch.search.listener;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.ssafy.etch.project.event.ProjectLikeCountChangedEvent;
import com.ssafy.etch.project.repository.ProjectRepository;
import com.ssafy.etch.search.document.ProjectDocument;
import com.ssafy.etch.search.repository.ProjectDocumentRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProjectLikeCountSync {

	private final ProjectRepository projectRepository;                 // DB 최신 상태
	private final ProjectDocumentRepository projectDocumentRepository; // ES upsert/delete

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void onLikeChanged(ProjectLikeCountChangedEvent evt) {
		projectRepository.findById(evt.projectId()).ifPresentOrElse(e -> {
			boolean visible = Boolean.TRUE.equals(e.getIsPublic())
				&& !Boolean.TRUE.equals(e.getIsDeleted());

			if (visible) {
				// DB를 진실로 삼아 전체 도큐먼트 업서트 (likeCount 포함)
				ProjectDocument doc = ProjectDocument.from(e);
				projectDocumentRepository.save(doc); // upsert, 멱등
			} else {
				// 비공개/삭제 → ES에서 제거 (멱등)
				projectDocumentRepository.deleteById(e.getId());
			}
		}, () -> projectDocumentRepository.deleteById(evt.projectId()));
	}
}
