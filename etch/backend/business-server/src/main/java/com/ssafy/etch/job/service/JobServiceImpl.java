package com.ssafy.etch.job.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.etch.global.exception.CustomException;
import com.ssafy.etch.global.exception.ErrorCode;
import com.ssafy.etch.job.dto.JobDTO;
import com.ssafy.etch.job.dto.JobResponseDTO;
import com.ssafy.etch.job.entity.JobEntity;
import com.ssafy.etch.job.repository.JobRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {
	private final JobRepository jobRepository;

	@Override
	public JobResponseDTO getJob(Long jobId) {
		JobDTO jobDTO = jobRepository.findById(jobId)
			.map(JobEntity::toJobDTO)
			.orElseThrow(() -> new CustomException(ErrorCode.JOB_NOT_FOUND));

		return JobResponseDTO.from(jobDTO);
	}

	@Override
	public List<JobResponseDTO> getJobsByDate(LocalDate startDate, LocalDate endDate) {
		LocalDateTime startInclusive = startDate.atStartOfDay();       // yyyy-MM-dd 00:00:00
		LocalDateTime endExclusive = endDate.plusDays(1).atStartOfDay();

		// ✅ 순서: startInclusive, endExclusive
		List<JobEntity> jobEntityList = jobRepository.findJobsStartingOrEndingInPeriod(startInclusive, endExclusive);

		return jobEntityList.stream().map(e -> JobResponseDTO.from(e.toJobDTO())).toList();
	}

	@Override
	public List<JobResponseDTO> getJobsByExpirationDate(LocalDate startDate, LocalDate endDate) {
		LocalDateTime startInclusive = startDate.atStartOfDay();       // yyyy-MM-dd 00:00:00
		LocalDateTime endExclusive = endDate.plusDays(1).atStartOfDay();

		List<JobEntity> jobEntityList = jobRepository.findByExpirationDateBetween(startInclusive, endExclusive);

		return jobEntityList.stream().map(e -> JobResponseDTO.from(e.toJobDTO())).toList();
	}
}
