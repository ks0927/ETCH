import { Link } from "react-router";
import noImg from "../../assets/noImg.png";
import { funcData } from "../../types/funcComponentData";
import { mockJobList } from "../../types/mock/mockJobListData";
import HomeFuncComponent from "../organisms/home/homeFuncComponent";
import JobList from "../organisms/job/jobList";
import JobDetailModal from "../organisms/job/jobDetailModal";
import HomeNewsCard from "../organisms/home/homeNewsCard";
import HomeProjectCard from "../organisms/home/homeProjectCard";
import ProjectSVG from "../svg/projectSVG";
import SeeMore from "../svg/seeMore";
import { LatestNewsData } from "../../api/newsApi";
import { useEffect, useState } from "react";

function HomePage() {
  const [latestNewsData, setLatestNewsData] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestNews = async () => {
      const data = await LatestNewsData();
      setLatestNewsData(data);
    };

    loadLatestNews();
  }, []);

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleCloseModal = () => {
    setSelectedJobId(null);
  };

  const selectedJob = mockJobList.find((job) => job.id === selectedJobId);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#007DFC] to-[#0056CC] w-full py-12 sm:py-16 lg:py-20 px-6 relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-8 h-8 bg-white rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto text-white relative z-10 gap-8">
          <div className="text-center lg:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              IT 취업의 모든 것
              <br />
              <span className="text-blue-200">E:TCH</span>에서 시작하세요
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              채용 정보부터 기업 분석, 포트폴리오 작성까지
              <br />
              IT 취업 준비를 위한 모든 것을 한 곳에서
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={"/mypage"}>
                <button className="bg-white cursor-pointer text-[#007DFC] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                  시작하기
                </button>
              </Link>
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <img
              src={noImg}
              alt="메인 이미지"
              className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* 채용 정보 */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-2xl sm:text-3xl text-gray-900">
                진행중인 채용
              </h2>
              <div className="flex-1"></div>
              <Link to={"/jobs"}>
                <SeeMore />
              </Link>
            </div>
            <JobList
              jobs={mockJobList.slice(0, 3)}
              onJobClick={handleJobClick}
            />
          </div>
        </div>
      </section>

      {/* 프로젝트 + 뉴스 */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* 인기 프로젝트 - 2/3 너비 */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 h-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                      <ProjectSVG />
                    </div>
                    <h2 className="font-bold text-2xl sm:text-3xl text-gray-900">
                      인기 프로젝트
                    </h2>
                  </div>
                  <Link to={"/projects"}>
                    <SeeMore />
                  </Link>
                </div>
                <HomeProjectCard />
              </div>
            </div>

            {/* 뉴스 - 1/3 너비 */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                    <h2 className="font-bold text-2xl sm:text-3xl text-gray-900">
                      뉴스
                    </h2>
                  </div>
                  <Link to={"/news"}>
                    <SeeMore />
                  </Link>
                </div>
                <HomeNewsCard newsData={latestNewsData} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 소개 */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              E:TCH의 주요 기능
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              IT 취업 성공을 위한 모든 도구와 정보를 하나의 플랫폼에서
              만나보세요
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <HomeFuncComponent funcData={funcData} />
          </div>
        </div>
      </section>

      {/* 모달 */}
      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default HomePage;
