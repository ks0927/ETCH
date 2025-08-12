package com.ssafy.etch.job.entity;

import com.ssafy.etch.job.dto.AppliedJobDTO;
import com.ssafy.etch.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "applied_job")
public class AppliedJobEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private JobEntity job;

    @Enumerated(EnumType.STRING)
    private ApplyStatusType status = ApplyStatusType.DOCUMENT_DONE;

    public void updateStatus(ApplyStatusType status) {
        this.status = status;
    }

    public static AppliedJobEntity from(AppliedJobDTO dto) {
        AppliedJobEntity entity = new AppliedJobEntity();
        entity.id = dto.getId();
        entity.member = dto.getMember();
        entity.job = dto.getJob();
        entity.status = dto.getStatus();
        return entity;
    }

    public AppliedJobDTO toAppliedJobDTO() {
        return AppliedJobDTO.builder()
                .id(id)
                .member(member)
                .job(job)
                .status(status)
                .build();
    }
}
