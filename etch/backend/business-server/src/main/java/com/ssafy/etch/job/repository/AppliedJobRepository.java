package com.ssafy.etch.job.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.etch.job.entity.AppliedJobEntity;
import com.ssafy.etch.job.statistics.MonthlyCountRow;
import com.ssafy.etch.job.statistics.StatsRow;

public interface AppliedJobRepository extends JpaRepository<AppliedJobEntity, Long> {
	List<AppliedJobEntity> findByMember_Id(Long memberId);

	boolean existsByMember_IdAndJob_Id(Long memberId, Long jobId);

	// ====== (A) 확률 API용: 통계 집계치 ======
	@Query(value = """
		  SELECT
		    SUM(CASE WHEN status IN ('INTERVIEW_DONE','INTERVIEW_FAILED','FINAL_PASSED') THEN 1 ELSE 0 END) AS docPassCnt,
		    SUM(CASE WHEN status IN ('DOCUMENT_FAILED','INTERVIEW_DONE','INTERVIEW_FAILED','FINAL_PASSED') THEN 1 ELSE 0 END) AS docTotalCnt,
		    SUM(CASE WHEN status = 'FINAL_PASSED' THEN 1 ELSE 0 END) AS interviewPassCnt,
		    SUM(CASE WHEN status IN ('INTERVIEW_FAILED','FINAL_PASSED') THEN 1 ELSE 0 END) AS interviewTotalCnt,
		    SUM(CASE WHEN status = 'FINAL_PASSED' THEN 1 ELSE 0 END) AS finalCnt,
		    SUM(CASE WHEN status IN ('DOCUMENT_DONE','DOCUMENT_FAILED','INTERVIEW_DONE','INTERVIEW_FAILED','FINAL_PASSED') THEN 1 ELSE 0 END) AS finalTotalCnt
		  FROM applied_job
		  WHERE (:memberId IS NULL OR member_id = :memberId)
		    AND (:fromTs IS NULL OR created_at >= :fromTs)
		    AND (:toTs   IS NULL OR created_at <  :toTs)
		""", nativeQuery = true)
	StatsRow fetchRateStats(
		@Param("memberId") Long memberId,
		@Param("fromTs") LocalDateTime fromTs,
		@Param("toTs") LocalDateTime toTs
	);

	@Query(value = """
		  SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym,
		         COUNT(*) AS cnt
		  FROM applied_job
		  WHERE (:memberId IS NULL OR member_id = :memberId)
		    AND (:excludeScheduled = 0 OR status <> 'SCHEDULED')
		    AND created_at >= MAKEDATE(:year, 1)
		    AND created_at <  DATE_ADD(MAKEDATE(:year, 1), INTERVAL 1 YEAR)
		  GROUP BY ym
		  ORDER BY ym
		""", nativeQuery = true)
	List<MonthlyCountRow> fetchMonthlyCountsOfYear(
		@Param("memberId") Long memberId,
		@Param("year") int year,
		@Param("excludeScheduled") int excludeScheduled // 1=제외, 0=포함
	);

	@Query(value = """
		  SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym,
		         COUNT(*) AS cnt
		  FROM applied_job
		  WHERE (:memberId IS NULL OR member_id = :memberId)
		    AND (:excludeScheduled = 0 OR status <> 'SCHEDULED')
		    AND created_at >= DATE_ADD(MAKEDATE(:year, 1), INTERVAL :month - 1 MONTH)
		    AND created_at <  DATE_ADD(MAKEDATE(:year, 1), INTERVAL :month MONTH)
		  GROUP BY ym
		  ORDER BY ym
		""", nativeQuery = true)
	List<MonthlyCountRow> fetchMonthlyCountOfMonth(
		@Param("memberId") Long memberId,
		@Param("year") int year,
		@Param("month") int month,                     // 1~12
		@Param("excludeScheduled") int excludeScheduled
	);

}
