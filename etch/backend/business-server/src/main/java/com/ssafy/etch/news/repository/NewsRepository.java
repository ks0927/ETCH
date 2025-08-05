package com.ssafy.etch.news.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.etch.news.entity.NewsEntity;

public interface NewsRepository extends JpaRepository<NewsEntity, Long> {
	List<NewsEntity> findAllByOrderByPublishedAtDesc(); // 최신순
}
