package com.ssafy.etch.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND("USER_404", "사용자를 찾을 수 없습니다."),
    INVALID_INPUT("INPUT_400", "잘못된 입력입니다."),
    INTERNAL_ERROR("INTERNAL_500", "서버 오류가 발생했습니다.");

    private final String code;
    private final String message;
}
