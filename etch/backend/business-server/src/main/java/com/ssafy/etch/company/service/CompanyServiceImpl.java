package com.ssafy.etch.company.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.ssafy.etch.company.dto.CompanyRankingDTO;

@Service
public class CompanyServiceImpl implements CompanyService {

	private final RedisTemplate<String, String> redisTemplate;

	public CompanyServiceImpl(RedisTemplate<String, String> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}

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
}
