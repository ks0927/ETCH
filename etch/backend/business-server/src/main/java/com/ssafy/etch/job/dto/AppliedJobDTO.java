package com.ssafy.etch.job.dto;

import com.ssafy.etch.job.entity.ApplyStatusType;
import com.ssafy.etch.job.entity.JobEntity;
import com.ssafy.etch.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

@Builder(toBuilder = true)
@Getter
public class AppliedJobDTO {
    private Long id;
    private MemberEntity member;
    private JobEntity job;
    private ApplyStatusType status;
}
