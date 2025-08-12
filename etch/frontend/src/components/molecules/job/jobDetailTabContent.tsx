import type { JobItemProps } from "../../atoms/listItem";
import type { Job } from "../../../types/job";
import type { Company } from "../../../types/companyData";
import type { News } from "../../../types/newsTypes";

interface JobDetailTabContentProps {
  activeTab: "details" | "company" | "news";
  job: JobItemProps;
  jobDetail: Job | null;
  companyInfo: Company | null;
  companyNews: News[];
  errors: {
    jobError: string | null;
    companyError: string | null;
    newsError: string | null;
  };
}

export default function JobDetailTabContent({
  activeTab,
  job,
  jobDetail,
  companyInfo,
  companyNews,
  errors,
}: JobDetailTabContentProps) {
  const renderContent = () => {
    // jobDetail 또는 fallback으로 job 사용
    const currentJob = jobDetail || job;

    // 배열이 아닐 수 있으므로 안전하게 처리
    const safeRegions = Array.isArray(currentJob.regions)
      ? currentJob.regions
      : [];
    const safeJobCategories = Array.isArray(currentJob.jobCategories)
      ? currentJob.jobCategories
      : [];
    const safeIndustries = Array.isArray(currentJob.industries)
      ? currentJob.industries
      : [];

    switch (activeTab) {
      case "details":
        if (errors.jobError) {
          return (
            <div className="p-6">
              <div className="text-red-600">{errors.jobError}</div>
            </div>
          );
        }

        return (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">공고 상세</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  회사명
                </label>
                <p className="text-gray-900">{currentJob.companyName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  위치
                </label>
                <p className="text-gray-900">
                  {safeRegions.join(", ") || "위치 정보 없음"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  시작일
                </label>
                <p className="text-gray-900">
                  {new Date(currentJob.openingDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  마감일
                </label>
                <p className="text-gray-900">
                  {new Date(currentJob.expirationDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  근무형태
                </label>
                <p className="text-gray-900">{currentJob.workType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  학력요건
                </label>
                <p className="text-gray-900">{currentJob.educationLevel}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                직무 분야
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {safeJobCategories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-md"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                산업 분야
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {safeIndustries.map((industry, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-md"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case "company":
        if (errors.companyError) {
          return (
            <div className="p-6">
              <div className="text-red-600">{errors.companyError}</div>
            </div>
          );
        }

        if (!companyInfo) {
          return (
            <div className="p-6">
              <div className="text-gray-600">
                기업 정보를 불러오는 중입니다...
              </div>
            </div>
          );
        }

        return (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">기업 정보</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  회사명
                </label>
                <p className="text-gray-900">{companyInfo.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">CEO</label>
                <p className="text-gray-900">{companyInfo.ceoName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  설립일
                </label>
                <p className="text-gray-900">
                  {new Date(companyInfo.foundedDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  전체 직원 수
                </label>
                <p className="text-gray-900">
                  {companyInfo.totalEmployees.toLocaleString()}명
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  평균 연봉
                </label>
                <p className="text-gray-900">
                  {companyInfo.salary.toLocaleString()}원
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  평균 근속연수
                </label>
                <p className="text-gray-900">{companyInfo.serviceYear}년</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">업종</label>
              <p className="text-gray-900">{companyInfo.industry}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                주요 제품/서비스
              </label>
              <p className="text-gray-900">{companyInfo.mainProducts}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                회사 소개
              </label>
              <p className="text-gray-900 whitespace-pre-wrap">
                {companyInfo.summary}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">주소</label>
              <p className="text-gray-900">{companyInfo.address}</p>
            </div>
            {companyInfo.homepageUrl && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  홈페이지
                </label>
                <br />
                <a
                  href={companyInfo.homepageUrl.startsWith('http') 
                    ? companyInfo.homepageUrl 
                    : `https://${companyInfo.homepageUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {companyInfo.homepageUrl}
                </a>
              </div>
            )}
          </div>
        );
      case "news":
        if (errors.newsError) {
          return (
            <div className="p-6">
              <div className="text-red-600">{errors.newsError}</div>
            </div>
          );
        }

        return (
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold">기업 뉴스</h3>
            {companyNews.length === 0 ? (
              <div className="text-gray-600">관련 뉴스가 없습니다.</div>
            ) : (
              <div className="space-y-4">
                {companyNews.map((news) => (
                  <div
                    key={news.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => window.open(news.url, '_blank', 'noopener,noreferrer')}
                  >
                    <div className="flex gap-4">
                      {news.thumbnailUrl && (
                        <img
                          src={news.thumbnailUrl}
                          alt={news.title}
                          className="flex-shrink-0 object-cover w-20 h-20 rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="mb-2 font-medium text-gray-900 hover:text-blue-600">
                          {news.title}
                        </h4>
                        <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                          {news.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{news.company?.name || "회사명 없음"}</span>
                          <span>
                            {new Date(news.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
}
