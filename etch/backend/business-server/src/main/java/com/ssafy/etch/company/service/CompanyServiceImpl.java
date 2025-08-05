package com.ssafy.etch.company.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.ssafy.etch.company.dto.CompanyInfoDTO;
import com.ssafy.etch.company.dto.CompanyRankingDTO;
import com.ssafy.etch.company.entity.CompanyEntity;
import com.ssafy.etch.company.repository.CompanyRepository;

@Service
public class CompanyServiceImpl implements CompanyService {

	private final RedisTemplate<String, String> redisTemplate;
	private final CompanyRepository companyRepository;

	public CompanyServiceImpl(RedisTemplate<String, String> redisTemplate,  CompanyRepository companyRepository) {
		this.redisTemplate = redisTemplate;
		this.companyRepository = companyRepository;
	}

	// 좋아요가 많은 순으로 정렬한 10개의 기업
	@Override
	public List<CompanyRankingDTO> getTop10() {
		ListOperations<String, String> listOps = redisTemplate.opsForList();
		HashOperations<String, String, String> hashOps = redisTemplate.opsForHash();

		List<String> keys = listOps.range("top10_companies", 0, -1);
		if (keys == null || keys.isEmpty()) return List.of();

		List<CompanyRankingDTO> result = new ArrayList<>();
		for (String key : keys) {
			Map<String, String> info = hashOps.entries(key);

			if (info.isEmpty()) continue;

			String name = info.getOrDefault("company_name", "");
			long likes = 0L;

			try {
				likes = Long.parseLong(info.getOrDefault("likes", "0"));
			} catch (NumberFormatException ignored) {
			}

			result.add(new CompanyRankingDTO(name, likes));
		}

			result.sort(Comparator.comparingLong(CompanyRankingDTO::getLikes).reversed());
			return result.size() > 10 ? result.subList(0, 10) : result;
	}

	// 기업정보
	@Override
	public CompanyInfoDTO getCompanyInfo(long id) {
		CompanyEntity entity = companyRepository.findById(id);

		if (entity == null) {
			throw new RuntimeException("기업 정보를 찾을 수 없습니다.");
		}

		return CompanyInfoDTO.builder()
			.id(entity.getId())
			.name(entity.getName())
			.industry(entity.getIndustry())
			.mainProducts(entity.getMainProducts())
			.ceoName(entity.getCeoName())
			.summary(entity.getSummary())
			.stock(entity.getStock())
			.address(entity.getAddress())
			.homepageUrl(entity.getHomepageUrl())
			.foundedDate(entity.getFoundedDate())
			.totalEmployees(entity.getTotalEmployees())
			.maleEmployees(entity.getMaleEmployees())
			.femaleEmployees(entity.getFemaleEmployees())
			.maleRatio(entity.getMaleRatio())
			.femaleRatio(entity.getFemaleRatio())
			.salary(entity.getSalary())
			.serviceYear(entity.getServiceYear())
			.build();
	}
}
