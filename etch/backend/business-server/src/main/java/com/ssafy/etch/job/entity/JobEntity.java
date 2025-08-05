package com.ssafy.etch.job.entity;

import java.time.LocalDate;

import com.ssafy.etch.company.entity.CompanyEntity;

import com.ssafy.etch.job.dto.JobDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "job")
public class JobEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String title;

	@Column(name = "opening_date")
	private LocalDate openingDate;

	@Column(name = "expiration_date")
	private LocalDate expirationDate;

	@Column(name = "created_at")
	private LocalDate createdAt;

	@Column(name = "updated_at")
	private LocalDate updatedAt;

	@ManyToOne
	@JoinColumn(name = "company_id", nullable = false)
	private CompanyEntity company;

	public JobDTO toJobDTO() {
		return JobDTO.builder()
				.id(id)
				.title(title)
				.openingDate(openingDate)
				.expirationDate(expirationDate)
				.createdAt(createdAt)
				.updatedAt(updatedAt)
				.build();
	}
}
