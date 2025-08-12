package com.ssafy.etch.job.service;

import com.ssafy.etch.global.exception.CustomException;
import com.ssafy.etch.global.exception.ErrorCode;
import com.ssafy.etch.job.dto.AppliedJobDTO;
import com.ssafy.etch.job.dto.AppliedJobListResponseDTO;
import com.ssafy.etch.job.entity.AppliedJobEntity;
import com.ssafy.etch.job.entity.ApplyStatusType;
import com.ssafy.etch.job.entity.JobEntity;
import com.ssafy.etch.job.repository.AppliedJobRepository;
import com.ssafy.etch.job.repository.JobRepository;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppliedJobServiceImpl implements AppliedJobService {

    private final AppliedJobRepository appliedJobRepository;
    private final MemberRepository memberRepository;
    private final JobRepository jobRepository;

    @Override
    @Transactional
    public void createAppliedJob(Long memberId, Long jobId) {
        if (appliedJobRepository.existsByMember_IdAndJob_Id(memberId, jobId)) {
            throw new CustomException(ErrorCode.ALREADY_APPLIED);
        }

        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        JobEntity job = jobRepository.findById(jobId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTENT_NOT_FOUND));

        AppliedJobEntity appliedJob = AppliedJobEntity.from(
                AppliedJobDTO.builder()
                        .job(job)
                        .member(member)
                        .status(ApplyStatusType.SCHEDULED)
                        .build()
        );

        appliedJobRepository.save(appliedJob);
    }
}
