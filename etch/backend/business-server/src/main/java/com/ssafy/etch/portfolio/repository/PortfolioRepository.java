package com.ssafy.etch.portfolio.repository;

import com.ssafy.etch.portfolio.entity.PortfolioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioRepository extends JpaRepository<PortfolioEntity, Long> {
    List<PortfolioEntity> findAllByMember_Id(Long memberId);
}
