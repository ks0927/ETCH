package com.ssafy.etch.job.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

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
			.orElseThrow(() -> new NoSuchElementException("채용공고를 찾을 수 없습니다"));

		return JobResponseDTO.from(jobDTO);
	}

	@Override
	public List<JobResponseDTO> getJobsByDate(LocalDate startDate, LocalDate endDate) {
		LocalDateTime startInclusive = startDate.atStartOfDay();                 // yyyy-MM-dd 00:00:00
		LocalDateTime endExclusive = endDate.plusDays(1).atStartOfDay();

		List<JobEntity> jobEntityList = jobRepository
			.findJobsStartingOrEndingInPeriod(
				endExclusive, startInclusive
			);
		List<JobResponseDTO> jobResponseDTOList = new ArrayList<>();
		for (JobEntity jobEntity : jobEntityList) {
			JobDTO jobDTO = jobEntity.toJobDTO();
			jobResponseDTOList.add(JobResponseDTO.from(jobDTO));
		}

		return jobResponseDTOList;
	}
}
