package com.ssafy.etch.company.repository;

import com.ssafy.etch.company.entity.CompanyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface CompanyRepository extends JpaRepository<CompanyEntity, Long> {
	CompanyEntity findById(long id);
    List<CompanyEntity> findAllByIdIn(Collection<Long> id);
}
