// 지원 상태 타입 (백엔드 ApplyStatusType enum 기준)
export type ApplyStatusType =
  | "SCHEDULED" // 예정
  | "DOCUMENT_DONE" // 서류 제출 완료
  | "DOCUMENT_FAILED" // 서류 탈락
  | "INTERVIEW_DONE" // 면접 완료
  | "INTERVIEW_FAILED" // 면접 탈락
  | "FINAL_PASSED"; // 최종 합격

// 지원 상태 업데이트 요청 (PUT /appliedJobs/{appliedJobId} 요청 Body)
export interface AppliedJobUpdateRequest {
  status: ApplyStatusType;
}

// 지원 공고 목록 응답 (GET /appliedJobs/list 응답)
export interface AppliedJobListResponse {
  id: number; // appliedJobId
  title: string; // 공고 제목
  companyName: string; // 회사명
  openingDate: string; // LocalDateTime -> ISO string
  closingDate: string; // expirationDate -> ISO string
  status: string; // ApplyStatusType.name() -> string
}

// API 파라미터 타입들
export interface ApplyJobParams {
  jobId: number;
}

export interface UpdateAppliedJobParams {
  appliedJobId: number;
}

export interface DeleteAppliedJobParams {
  appliedJobId: number;
}

// 지원 상태별 한국어 라벨 (UI 표시용)
export const ApplyStatusLabels: Record<ApplyStatusType, string> = {
  SCHEDULED: "지원 예정",
  DOCUMENT_DONE: "서류 제출 완료",
  DOCUMENT_FAILED: "서류 탈락",
  INTERVIEW_DONE: "면접 완료",
  INTERVIEW_FAILED: "면접 탈락",
  FINAL_PASSED: "최종 합격",
};
