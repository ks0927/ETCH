package com.ssafy.etch.project.repository;

import com.ssafy.etch.project.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {
    List<ProjectEntity> findAllByIdIn(Collection<Long> id);
    List<ProjectEntity> findAll();
    Optional<ProjectEntity> findById(Long id);
}
