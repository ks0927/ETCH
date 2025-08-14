package com.ssafy.etch.project.event;

public record ProjectLikeChangedEvent(Long projectId, int delta) {
	public static ProjectLikeChangedEvent liked(Long projectId) {
		return new ProjectLikeChangedEvent(projectId, +1);
	}

	public static ProjectLikeChangedEvent unliked(Long projectId) {
		return new ProjectLikeChangedEvent(projectId, -1);
	}
}

