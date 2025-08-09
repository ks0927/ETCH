package com.ssafy.etch.project.repository;

import com.ssafy.etch.project.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {
    List<ProjectEntity> findAllByIdIn(Collection<Long> id);
    List<ProjectEntity> findAll();
    Optional<ProjectEntity> findById(Long id);

    @Query("select distinct p from ProjectEntity p " +
            "left join fetch p.projectTechs pt " +
            "left join fetch pt.techCode " +
            "where p.member.id = :memberId")
    List<ProjectEntity> findAllByMemberId(@Param("memberId") Long memberId);

    @Modifying
    @Query("update ProjectEntity p set p.viewCount = p.viewCount + 1 where p.id = :id")
    int increaseViewCount(@Param("id") Long id);
}
