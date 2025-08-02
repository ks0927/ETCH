package com.ssafy.etch.member.repository;

import com.ssafy.etch.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository  extends JpaRepository<MemberEntity,Long> {
    Optional<MemberEntity> findById(long id);

    Optional<MemberEntity> findByEmail(String email);
}
