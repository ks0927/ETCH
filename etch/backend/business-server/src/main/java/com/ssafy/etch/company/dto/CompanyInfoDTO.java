package com.ssafy.etch.company.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class CompanyInfoDTO {
	private Long id;
	private String name;
	private String industry;
	private String mainProducts;
	private String ceoName;
	private String summary;
	private String stock;
	private String address;
	private String homepageUrl;
	private LocalDate foundedDate;
	private Long totalEmployees;
	private Long maleEmployees;
	private Long femaleEmployees;
	private Double maleRatio;
	private Double femaleRatio;
	private Long salary;
	private Long serviceYear;
}
