package com.ssafy.etch.job.service;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.etch.job.dto.JobResponseDTO;

public interface JobService {
	JobResponseDTO getJob(Long jobId);

	List<JobResponseDTO> getJobsByDate(LocalDate startDate, LocalDate endDate);

	List<JobResponseDTO> getJobsByExpirationDate(LocalDate startDate, LocalDate endDate);
}
