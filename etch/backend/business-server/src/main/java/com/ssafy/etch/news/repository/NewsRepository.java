package com.ssafy.etch.news.repository;

import com.ssafy.etch.news.entity.NewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface NewsRepository extends JpaRepository<NewsEntity, Long> {
    List<NewsEntity> findAllByIdIn(Collection<Long> id);
    List<NewsEntity> findAllByOrderByPublishedAtDesc(); // 최신순
    List<NewsEntity> findAllByCompanyIdOrderByPublishedAtDesc(Long companyId); // 특정 기업에 대한 기사 목록
}
