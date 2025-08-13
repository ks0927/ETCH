import { Link } from "react-router";
import noImg from "../../assets/noImg.png";
import { funcData } from "../../types/funcComponentData";
import HomeFuncComponent from "../organisms/home/homeFuncComponent";
import JobList from "../organisms/job/jobList";
import JobDetailModal from "../organisms/job/jobDetailModal";
import HomeNewsCard from "../organisms/home/homeNewsCard";
import HomeProjectCard from "../organisms/home/homeProjectCard";
import ProjectSVG from "../svg/projectSVG";
import SeeMore from "../svg/seeMore";
import { LatestNewsData } from "../../api/newsApi";
import { useEffect, useState } from "react";
import type { News } from "../../types/newsTypes";

function HomePage() {
  const [latestNewsData, setLatestNewsData] = useState<News[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  console.log(selectedJobId);
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

  const selectedJob = null; // mockJobList 제거됨
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#007DFC] to-[#0056CC] w-full py-12 sm:py-16 lg:py-20 px-6 relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-20 h-20 bg-white rounded-full top-10 left-10"></div>
          <div className="absolute w-16 h-16 bg-white rounded-full top-32 right-20"></div>
          <div className="absolute w-12 h-12 bg-white rounded-full bottom-20 left-1/4"></div>
          <div className="absolute w-8 h-8 bg-white rounded-full bottom-10 right-10"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 mx-auto text-white lg:flex-row max-w-7xl">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              IT 취업의 모든 것
              <br />
              <span className="text-blue-200">E:TCH</span>에서 시작하세요
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-blue-100 sm:text-xl">
              채용 정보부터 기업 분석, 포트폴리오 작성까지
              <br />
              IT 취업 준비를 위한 모든 것을 한 곳에서
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
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
              className="w-full h-auto transition-transform duration-300 transform shadow-2xl rounded-2xl hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 채용 정보 */}
      <section className="py-12 sm:py-16">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="p-6 bg-white shadow-sm rounded-3xl sm:p-8">
            <div className="flex items-center mb-6 space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-xl">
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
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                진행중인 채용
              </h2>
              <div className="flex-1"></div>
              <Link to={"/jobs"}>
                <SeeMore />
              </Link>
            </div>
            <JobList
              jobs={[]} // mockJobList 제거됨
              onJobClick={handleJobClick}
            />
          </div>
        </div>
      </section>

      {/* 프로젝트 + 뉴스 */}
      <section className="py-12 sm:py-16">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {/* 인기 프로젝트 - 2/3 너비 */}
            <div className="xl:col-span-2">
              <div className="h-full p-6 bg-white shadow-sm rounded-3xl sm:p-8">
                <div className="flex flex-col mb-6 space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-xl">
                      <ProjectSVG />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
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
              <div className="h-full p-6 bg-white shadow-sm rounded-3xl sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-xl">
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
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
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
        <div className="px-6 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              E:TCH의 주요 기능
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              IT 취업 성공을 위한 모든 도구와 정보를 하나의 플랫폼에서
              만나보세요
            </p>
          </div>
          <div className="p-6 bg-white shadow-sm rounded-3xl sm:p-8">
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
