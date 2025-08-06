package com.ssafy.etch.coverLetter.repository;

import com.ssafy.etch.coverLetter.entity.CoverLetterEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CoverLetterRepository extends JpaRepository<CoverLetterEntity, Long> {
    Optional<List<CoverLetterEntity>> findAllByMemberId(Long memberId);
}
