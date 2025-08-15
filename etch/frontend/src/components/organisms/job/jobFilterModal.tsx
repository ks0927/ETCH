import { useState, useEffect } from "react";

export interface JobFilters {
  regions: string[];
  industries: string[];
  jobCategories: string[];
  workTypes: string[];
  educationLevels: string[];
}

interface JobFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: JobFilters) => void;
  onReset: () => void;
  initialFilters: JobFilters;
}

// 필터 옵션들 (실제로는 API에서 가져오거나 상수로 관리)
const FILTER_OPTIONS = {
  regions: [
    "서울",
    "경기",
    "광주",
    "대구",
    "대전",
    "부산",
    "울산",
    "인천",
    "강원",
    "경남",
    "경북",
    "전남",
    "전북",
    "충북",
    "충남",
    "제주",
    "전국",
    "세종",
  ],
  industries: [
    "서비스업",
    "제조,화학",
    "IT,웹,통신",
    "은행,금융업",
    "미디어,디자인",
    "교육업",
    "의료,제약,복지",
    "판매,유통",
    "건설업",
    "기관,협회",
  ],
  jobCategories: [
    "프론트엔드",
    "백엔드",
    "모바일",
    "데이터/AI",
    "게임/그래픽",
    "보안/인프라",
    "DevOps/클라우드",
    "임베디드/하드웨어",
    "기타/공통",
  ],
  workTypes: [
    "정규직",
    "계약직",
    "병역특례",
    "인턴직",
    "아르바이트",
    "파견직",
    "해외취업",
    "위촉직",
    "프리랜서",
    "계약직 (정규직 전환가능)",
    "인턴직 (정규직 전환가능)",
    "교육생",
    "별정직",
    "파트",
    "전임",
    "기간제",
    "무기계약직",
    "전문계약직",
    "전문연구요원",
    "산업기능요원",
    "현역",
    "보충역",
  ],
  educationLevels: [
    "학력무관",
    "고등학교졸업",
    "대학졸업(2,3년)",
    "대학교졸업(4년)",
    "석사졸업",
    "박사졸업",
    "고등학교졸업이상",
    "대학졸업(2,3년)이상",
    "대학교졸업(4년)이상",
    "석사졸업이상",
  ],
};

export default function JobFilterModal({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialFilters,
}: JobFilterModalProps) {
  const [filters, setFilters] = useState<JobFilters>(initialFilters);

  // 모달이 열릴 때마다 초기 필터로 리셋
  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  // 필터 토글 함수
  const toggleFilter = (category: keyof JobFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  // 전체 선택/해제 함수
  const toggleAll = (category: keyof JobFilters) => {
    const allOptions = FILTER_OPTIONS[category];
    const isAllSelected = allOptions.every((option) =>
      filters[category].includes(option)
    );

    setFilters((prev) => ({
      ...prev,
      [category]: isAllSelected ? [] : [...allOptions],
    }));
  };

  // 필터 적용
  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  // 필터 초기화
  const handleReset = () => {
    const emptyFilters: JobFilters = {
      regions: [],
      industries: [],
      jobCategories: [],
      workTypes: [],
      educationLevels: [],
    };
    setFilters(emptyFilters);
    onReset(); // 부모 컴포넌트의 onReset 함수도 호출
  };

  if (!isOpen) return null;

  // 필터 섹션 렌더링 컴포넌트
  const FilterSection = ({
    title,
    category,
    options,
  }: {
    title: string;
    category: keyof JobFilters;
    options: string[];
  }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <button
          onClick={() => toggleAll(category)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {options.every((option) => filters[category].includes(option))
            ? "전체 해제"
            : "전체 선택"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center p-2 rounded cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={filters[category].includes(option)}
              onChange={() => toggleFilter(category, option)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              채용공고 필터
            </h3>
            <p className="text-sm text-gray-600">
              원하는 조건으로 채용공고를 필터링하세요
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 필터 내용 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <FilterSection
            title="지역"
            category="regions"
            options={FILTER_OPTIONS.regions}
          />
          <FilterSection
            title="업종"
            category="industries"
            options={FILTER_OPTIONS.industries}
          />
          <FilterSection
            title="직무"
            category="jobCategories"
            options={FILTER_OPTIONS.jobCategories}
          />
          <FilterSection
            title="고용형태"
            category="workTypes"
            options={FILTER_OPTIONS.workTypes}
          />
          <FilterSection
            title="학력"
            category="educationLevels"
            options={FILTER_OPTIONS.educationLevels}
          />
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            초기화
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
