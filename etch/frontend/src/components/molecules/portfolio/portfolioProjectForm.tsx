import { useState } from "react";
import {
  PortfolioProjectState,
  type PortfolioProject,
} from "../../../types/portfolio/portfolioDatas";
import {
  PortfolioWriteStackData,
  type PortfolioStackEnum,
} from "../../../types/portfolio/portfolioStack";
import type { SelectProps } from "../../atoms/select";

function Select({
  options,
  onChange,
  disabled = false,
  placeholder = "선택하세요",
  className = "",
}: SelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (onChange && value) {
      onChange(value);
      // 선택 후 초기화
      event.target.value = "";
    }
  };

  return (
    <select
      onChange={handleChange}
      disabled={disabled}
      className={`w-full p-3 border-2 border-blue-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      } ${className}`}
      defaultValue=""
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function PortfolioProjectForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: PortfolioProject) => void;
  initialData?: PortfolioProject;
}) {
  const [formData, setFormData] = useState<PortfolioProject>(
    initialData || { ...PortfolioProjectState }
  );
  const [dateError, setDateError] = useState<string>("");

  // 기술 스택을 PortfolioStackEnum[]로 관리
  const [selectedStacks, setSelectedStacks] = useState<PortfolioStackEnum[]>(
    []
  );

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

  // 기술 스택 관련 함수들
  const availableStacks = PortfolioWriteStackData.filter(
    (stack) => !selectedStacks.includes(stack.stack)
  );

  const selectOptions = availableStacks.map((stack) => ({
    value: stack.stack,
    label: stack.text,
  }));

  const handleStackToggle = (stack: PortfolioStackEnum) => {
    setSelectedStacks(
      (prev) =>
        prev.includes(stack)
          ? prev.filter((s) => s !== stack) // 제거
          : [...prev, stack] // 추가
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 제출 전 최종 날짜 검증
    if (!validateDates(formData.startAt, formData.endAt)) {
      return; // 검증 실패 시 제출하지 않음
    }

    // 선택된 스택을 {value, label} 형식으로 변환
    const stackData = selectedStacks.map((stackEnum) => {
      const stackInfo = PortfolioWriteStackData.find(
        (s) => s.stack === stackEnum
      );
      return {
        value: stackEnum,
        label: stackInfo?.text || stackEnum,
      };
    });

    // formData에 stack 포함해서 제출
    const submitData: PortfolioProject = {
      ...formData,
      stack: stackData,
    };

    onSubmit(submitData);

    // 폼 초기화
    setFormData({ ...PortfolioProjectState });
    setSelectedStacks([]);
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
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg border border-blue-200"
      >
        {/* 헤더 */}
        <div className="text-center pb-4 border-b border-blue-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            새 프로젝트 추가
          </h3>
          <p className="text-gray-600">프로젝트 정보를 입력해주세요</p>
        </div>

        {/* 프로젝트 기본 정보 */}
        <div className="space-y-5">
          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <svg
                className="w-4 h-4 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              프로젝트 명
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  projectName: e.target.value,
                }))
              }
              className="w-full p-3 border-2 border-blue-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
              placeholder="Shop Shop"
              required
            />
          </div>

          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <svg
                className="w-4 h-4 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              한 줄 소개
            </label>
            <input
              type="text"
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="w-full p-3 border-2 border-blue-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
              placeholder="개인 쇼핑몰 프로젝트"
              required
            />
          </div>

          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <svg
                className="w-4 h-4 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              상세 소개
              <span className="ml-auto text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                {formData.content.length}/1000자
              </span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              className="w-full p-4 border-2 border-blue-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none placeholder-gray-400"
              placeholder="프로젝트에 대한 상세한 설명을 작성해주세요.&#10;&#10;💡 포함하면 좋은 내용:&#10;• 프로젝트 개발 배경과 목적&#10;• 사용한 기술스택과 선택 이유&#10;• 주요 기능과 구현 과정&#10;• 어려웠던 점과 해결 방법&#10;• 프로젝트를 통해 얻은 경험과 성과"
              rows={6}
              maxLength={1000}
              required
            />
            <div className="text-xs text-gray-500 mt-2 bg-white/60 p-2 rounded-lg">
              💡 <strong>Tip:</strong> 프로젝트의 배경, 기술 선택 이유, 주요
              기능, 트러블슈팅 경험 등을 포함해 작성하면 더욱 좋은 포트폴리오가
              됩니다.
            </div>
          </div>
        </div>

        {/* 기술 스택 선택 */}
        <div className="bg-white/60 p-4 rounded-xl">
          <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
            <svg
              className="w-4 h-4 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            사용 기술 스택
          </h4>

          <Select
            options={selectOptions}
            onChange={(value) => handleStackToggle(value as PortfolioStackEnum)}
            disabled={availableStacks.length === 0}
            placeholder={
              availableStacks.length === 0
                ? "모든 기술 스택이 선택되었습니다"
                : "기술 스택을 선택하세요"
            }
          />

          {/* 선택된 기술 스택 표시 */}
          {selectedStacks.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-600 mb-2">
                선택된 기술 스택
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedStacks.map((stack) => {
                  const stackData = PortfolioWriteStackData.find(
                    (s) => s.stack === stack
                  );
                  return (
                    <span
                      key={stack}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200"
                    >
                      {stackData?.text || stack}
                      <button
                        type="button"
                        onClick={() => handleStackToggle(stack)}
                        className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors duration-200"
                        aria-label={`${stackData?.text || stack} 제거`}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {selectedStacks.length}개의 기술 스택이 선택되었습니다.
              </p>
            </div>
          )}
        </div>

        {/* 날짜 입력 */}
        <div className="bg-white/60 p-4 rounded-xl">
          <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
            <svg
              className="w-4 h-4 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            프로젝트 기간
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                시작일
              </label>
              <input
                type="date"
                value={formData.startAt}
                onChange={(e) => handleStartDateChange(e.target.value)}
                max={today}
                className={`w-full p-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-blue-100 transition-all duration-200 ${
                  dateError
                    ? "border-red-400 focus:border-red-400"
                    : "border-blue-200 focus:border-blue-400"
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                종료일
              </label>
              <input
                type="date"
                value={formData.endAt}
                onChange={(e) => handleEndDateChange(e.target.value)}
                max={today}
                className={`w-full p-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-blue-100 transition-all duration-200 ${
                  dateError
                    ? "border-red-400 focus:border-red-400"
                    : "border-blue-200 focus:border-blue-400"
                }`}
                required
              />
            </div>
          </div>
        </div>

        {/* Github URL */}
        <div className="group">
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <svg
              className="w-4 h-4 mr-2 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Github URL
          </label>
          <input
            type="url"
            value={formData.githubURL}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, githubURL: e.target.value }))
            }
            className="w-full p-3 border-2 border-blue-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
            placeholder="https://github.com/username/repository"
            required
          />
        </div>

        {/* 에러 메시지 */}
        {dateError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700 font-medium">{dateError}</span>
            </div>
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={!!dateError}
          className={`w-full p-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
            dateError
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          }`}
        >
          {dateError ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                  clipRule="evenodd"
                />
              </svg>
              날짜를 확인해주세요
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              프로젝트 추가하기
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

export default PortfolioProjectForm;
