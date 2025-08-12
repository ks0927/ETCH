package com.ssafy.etch.job.repository;

import com.ssafy.etch.job.entity.AppliedJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppliedJobRepository extends JpaRepository<AppliedJobEntity, Long> {
    List<AppliedJobEntity> findByMember_Id(Long memberId);
    boolean existsByMember_IdAndJob_Id(Long memberId, Long jobId);
}
