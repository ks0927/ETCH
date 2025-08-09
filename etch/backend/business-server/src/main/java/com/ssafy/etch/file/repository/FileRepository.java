package com.ssafy.etch.file.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.etch.file.entity.FileEntity;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
}
