package com.ssafy.etch.global.config;

import com.ssafy.etch.oauth.handler.CustomOAuth2FailureHandler;
import com.ssafy.etch.oauth.handler.CustomSuccessHandler;
import com.ssafy.etch.oauth.jwt.filter.JWTFilter;
import com.ssafy.etch.oauth.jwt.filter.JwtExceptionFilter;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import com.ssafy.etch.oauth.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final CustomOAuth2UserService customOAuth2UserService;
	private final CustomSuccessHandler customSuccessHandler;
	private final CustomOAuth2FailureHandler customOAuth2FailureHandler; // 추가
	private final JWTUtil jwtUtil;
	private final JwtExceptionFilter jwtExceptionFilter;

	@Bean
	public GrantedAuthorityDefaults grantedAuthorityDefaults() {
		return new GrantedAuthorityDefaults(""); // Remove the ROLE_ prefix
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

			@Override
			public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

				CorsConfiguration configuration = new CorsConfiguration();

				configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173", "https://etch.it.kr"));
				configuration.setAllowCredentials(true);
				configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 명시적으로 허용
				configuration.setAllowedHeaders(
					Arrays.asList("Authorization", "Content-Type", "X-Requested-With")); // 필요한 헤더만
				configuration.setMaxAge(3600L);

				configuration.setExposedHeaders(Arrays.asList("Set-Cookie", "Authorization"));

				return configuration;
			}
		}));
		//csrf disable.
		http.csrf((auth) -> auth.disable());

		//Form 로그인 방식 disable
		http.formLogin((auth) -> auth.disable());

		//HTTP Basic 인증 방식 disable
		http.httpBasic((auth) -> auth.disable());

		//JWTFilter 추가
		http.addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);
		//JwtExceptionFilter 추가
		http.addFilterBefore(jwtExceptionFilter, JWTFilter.class);

		//oauth2
				http.oauth2Login((auth) -> auth.userInfoEndpoint(
				(userInfoEndpointConfig -> userInfoEndpointConfig.userService(customOAuth2UserService)))
			.successHandler(customSuccessHandler)
			.failureHandler(customOAuth2FailureHandler));

		//경로별 인가 작업
		http.authorizeHttpRequests(
			(auth) -> auth.requestMatchers("/**", "/signup", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
				.permitAll()
				.requestMatchers(HttpMethod.POST, "/members/").hasAnyRole("GUEST")
				.requestMatchers("/projects/**/comments/**").hasRole("USER")
				.requestMatchers("/user/**", "/auth/me")
				.hasAnyRole("GUEST", "USER")
				.anyRequest()
				.authenticated());

		//세션 설정 : STATELESS
		http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}

}

