package com.ssafy.etch.company.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CompanyRankingDTO {
	private String name; // 회사명
	private long likes; // 좋아요 수
}
