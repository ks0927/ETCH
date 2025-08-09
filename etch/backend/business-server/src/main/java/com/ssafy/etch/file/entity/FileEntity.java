package com.ssafy.etch.file.entity;

import com.ssafy.etch.project.entity.ProjectEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_file")
@Getter
@NoArgsConstructor
public class FileEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private String url;

	@ManyToOne
	@JoinColumn(name = "project_post_id")
	private ProjectEntity project;
}
