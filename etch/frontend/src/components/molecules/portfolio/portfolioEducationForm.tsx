import { useState } from "react";
import {
  ActivityState,
  type education,
} from "../../../types/portfolio/portfolioDatas";

function PortfolioEducationForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: education) => void;
  initialData?: education;
}) {
  const [formData, setFormData] = useState<education>(
    initialData || { ...ActivityState }
  );
  const [dateError, setDateError] = useState<string>("");

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split("T")[0];

  // 날짜 검증 함수
  const validateDates = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        setDateError("종료일은 시작일보다 늦어야 합니다.");
        return false;
      } else {
        setDateError("");
        return true;
      }
    }
    setDateError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 제출 전 최종 날짜 검증
    if (!validateDates(formData.startAt, formData.endAt)) {
      return; // 검증 실패 시 제출하지 않음
    }

    onSubmit(formData);
    // 폼 초기화
    setFormData({ ...ActivityState });
    setDateError("");
  };

  const handleStartDateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, startAt: value }));
    validateDates(value, formData.endAt);
  };

  const handleEndDateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, endAt: value }));
    validateDates(formData.startAt, value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-lg bg-blue-50"
    >
      <h3 className="text-lg font-semibold text-blue-700">활동 정보 입력</h3>

      <div>
        <label className="block text-sm font-medium mb-1">기관/회사명</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, companyName: e.target.value }))
          }
          className="w-full p-2 border rounded"
          placeholder="삼성전자"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">활동명/설명</label>
        <input
          type="text"
          value={formData.active}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, active: e.target.value }))
          }
          className="w-full p-2 border rounded"
          placeholder="인턴십, 교육과정명 등"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">시작일</label>
          <input
            type="date"
            value={formData.startAt}
            onChange={(e) => handleStartDateChange(e.target.value)}
            max={today}
            className={`w-full p-2 border rounded ${
              dateError ? "border-red-500" : ""
            }`}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">종료일</label>
          <input
            type="date"
            value={formData.endAt}
            onChange={(e) => handleEndDateChange(e.target.value)}
            max={today}
            className={`w-full p-2 border rounded ${
              dateError ? "border-red-500" : ""
            }`}
            required
          />
        </div>
      </div>

      {/* 에러 메시지 표시 */}
      {dateError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          <span className="font-medium">⚠️ {dateError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!!dateError} // 에러가 있으면 버튼 비활성화
        className={`w-full p-2 rounded transition-colors ${
          dateError
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        활동 추가
      </button>
    </form>
  );
}

export default PortfolioEducationForm;
