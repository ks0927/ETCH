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
    @Query("select p from ProjectEntity p where p.isDeleted = false")
    List<ProjectEntity> findAll();

    @Query("select p from ProjectEntity p where p.id in :ids and p.isDeleted = false")
    List<ProjectEntity> findAllByIdIn(@Param("ids") Collection<Long> ids);

    @Query("select distinct p from ProjectEntity p " +
            "left join fetch p.projectTechs pt " +
            "left join fetch pt.techCode " +
            "where p.member.id = :memberId and p.isDeleted = false")
    List<ProjectEntity> findAllByMemberId(@Param("memberId") Long memberId);

    @Modifying
    @Query("update ProjectEntity p set p.viewCount = p.viewCount + 1 where p.id = :id and p.isDeleted = false")
    int increaseViewCount(@Param("id") Long id);

    @Query("""
      SELECT DISTINCT p
      FROM ProjectEntity p
      LEFT JOIN FETCH p.projectTechs pt
      LEFT JOIN FETCH pt.techCode tc
      WHERE p.id = :id
        AND p.isDeleted = false
    """)
    Optional<ProjectEntity> findDetailById(@Param("id") Long id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE ProjectEntity p
           SET p.isDeleted = true,
               p.updatedAt = CURRENT_DATE
        WHERE p.id = :id
           AND p.member.id = :memberId
           AND p.isDeleted = false
    """)
    int softDelete(@Param("id") Long id, @Param("memberId") Long memberId);
}
