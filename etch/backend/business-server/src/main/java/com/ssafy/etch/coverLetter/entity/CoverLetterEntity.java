package com.ssafy.etch.coverLetter.entity;

import com.ssafy.etch.coverLetter.dto.CoverLetterDTO;
import com.ssafy.etch.member.entity.MemberEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name="cover_letter")
@SQLRestriction("is_deleted = false")
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

    public CoverLetterDTO toCoverLetterDTO() {
        return CoverLetterDTO.builder()
                .id(id)
                .name(name)
                .answer1(answer1)
                .answer2(answer2)
                .answer3(answer3)
                .answer4(answer4)
                .answer5(answer5)
                .isDeleted(isDeleted)
                .build();
    }
}
