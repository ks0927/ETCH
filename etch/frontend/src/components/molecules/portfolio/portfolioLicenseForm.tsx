import { useState } from "react";
import {
  LicenseState,
  type language,
} from "../../../types/portfolio/portfolioDatas";

function PortfolioLangugaeForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: language) => void;
  initialData?: language;
}) {
  const [formData, setFormData] = useState<language>(
    initialData || { ...LicenseState }
  );
  const [dateError, setDateError] = useState<string>("");

  // 날짜 검증 함수 (미래 날짜 체크)
  const validateDate = (selectedDate: string) => {
    if (selectedDate) {
      const selected = new Date(selectedDate);
      const today = new Date();

      // 오늘 날짜를 YYYY-MM-DD 형식으로 변환 (시간 제거)
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);

      if (selected > today) {
        setDateError("취득일은 오늘보다 미래일 수 없습니다.");
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
    if (!validateDate(formData.getAt)) {
      return; // 검증 실패 시 제출하지 않음
    }

    onSubmit(formData);
    // 폼 초기화
    setFormData({ ...LicenseState });
    setDateError("");
  };

  const handleDateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, getAt: value }));
    validateDate(value);
  };

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-lg bg-green-50"
    >
      <h3 className="text-lg font-semibold text-green-700">자격증 정보 입력</h3>

      <div>
        <label className="block text-sm font-medium mb-1">자격증명</label>
        <input
          type="text"
          value={formData.licenseName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, licenseName: e.target.value }))
          }
          className="w-full p-2 border rounded"
          placeholder="정보처리기사"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          취득일
          <span className="text-xs text-gray-500 ml-1">
            (오늘까지 선택 가능)
          </span>
        </label>
        <input
          type="date"
          value={formData.getAt}
          onChange={(e) => handleDateChange(e.target.value)}
          max={getTodayString()} // HTML5 max 속성으로 미래 날짜 선택 제한
          className={`w-full p-2 border rounded ${
            dateError ? "border-red-500" : ""
          }`}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">발급기관</label>
        <input
          type="text"
          value={formData.issuer}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, issuer: e.target.value }))
          }
          className="w-full p-2 border rounded"
          placeholder="한국산업인력공단"
          required
        />
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
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        자격증 추가
      </button>
    </form>
  );
}

export default PortfolioLangugaeForm;
