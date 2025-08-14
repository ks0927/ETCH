package com.ssafy.etch.project.event;

public record ProjectViewIncreasedEvent(Long projectId, int delta) {
	public static ProjectViewIncreasedEvent one(Long projectId) {
		return new ProjectViewIncreasedEvent(projectId, 1);
	}
}

