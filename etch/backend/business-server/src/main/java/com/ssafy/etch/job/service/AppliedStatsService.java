package com.ssafy.etch.job.service;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.etch.job.dto.AppliedRatesResponseDTO;
import com.ssafy.etch.job.dto.MonthlyItemDTO;

public interface AppliedStatsService {
	public AppliedRatesResponseDTO getRates(Long memberId, LocalDate from, LocalDate to);

	public List<MonthlyItemDTO> getMonthlyCounts(Long memberId, int year, int month, boolean excludeScheduled);
}
