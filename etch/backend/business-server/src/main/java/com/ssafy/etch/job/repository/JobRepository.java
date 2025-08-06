package com.ssafy.etch.job.repository;

import com.ssafy.etch.job.entity.JobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface JobRepository extends JpaRepository<JobEntity, Long> {
    List<JobEntity> findAllByIdIn(Collection<Long> ids);
}
