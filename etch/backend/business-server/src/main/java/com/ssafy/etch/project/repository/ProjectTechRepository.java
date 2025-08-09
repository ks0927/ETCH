package com.ssafy.etch.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.etch.project.entity.ProjectTechEntity;

public interface ProjectTechRepository extends JpaRepository<ProjectTechEntity, Long>{
}
