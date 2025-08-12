package com.ssafy.etch.job.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.etch.job.entity.JobEntity;

public interface JobRepository extends JpaRepository<JobEntity, Long> {
	List<JobEntity> findAllByIdIn(Collection<Long> ids);

	List<JobEntity> findByOpeningDateLessThanAndExpirationDateGreaterThanEqual(
		LocalDateTime openingDate, LocalDateTime expirationDate
	);
}
