package com.ssafy.etch.portfolio.repository;

import com.ssafy.etch.portfolio.entity.PortfolioProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioProjectRepository extends JpaRepository<PortfolioProjectEntity,Long> {
}
