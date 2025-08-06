package com.ssafy.etch.coverLetter.entity;

import com.ssafy.etch.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name="cover_letter")
public class CoverLetterEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Lob
    private String answer1;

    @Lob
    private String answer2;

    @Lob
    private String answer3;

    @Lob
    private String answer4;

    @Lob
    private String answer5;

    private boolean isDeleted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private MemberEntity member;
}
