package com.ssafy.etch.job.entity;

public enum ApplyStatusType {
    SCHEDULED,            // 예정
    DOCUMENT_DONE,   // 서류 제출 완료
    DOCUMENT_FAILED,      // 서류 탈락
    INTERVIEW_DONE,  // 면접 완료
    INTERVIEW_FAILED,     // 면접 탈락
    FINAL_PASSED // 최종 합격
}
