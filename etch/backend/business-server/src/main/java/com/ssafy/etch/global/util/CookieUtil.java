package com.ssafy.etch.global.util;

import jakarta.servlet.http.Cookie;

public class CookieUtil {
    public static Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);

        // HTTPS 환경에서만 쿠키를 전송(배포 시 주석 해제)
        // cookie.setSecure(true);

        // 모든 경로에서 쿠키에 접근
        cookie.setPath("/");
        // JavaScript를 통해 쿠키에 접근할 수 없도록 설정 (XSS 공격 방지)
        cookie.setHttpOnly(true);

        return cookie;
    }
}
