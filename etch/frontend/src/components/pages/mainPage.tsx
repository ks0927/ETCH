import testImg from "../../assets/testImg.png";
import { funcData } from "../../types/funcComponentData";
import { mockJobs } from "../../types/mockJobData";
import { mockNews } from "../../types/mockNewsData";
import { mockProjects } from "../../types/mockProjectData";
import MainFuncComponent from "../organisms/main/mainFuncComponent";
import MainJobCard from "../organisms/main/mainJobCard";
import MainNewsCard from "../organisms/main/mainNewsCard";
import MainProjectCard from "../organisms/main/mainProjectCard";

function MainPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#007DFC] w-full py-10 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto text-white">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">
              IT 취업의 모든 것
              <br />
              E:TCH에서 시작하세요
            </h1>
            <p className="mt-4 text-base md:text-lg">
              채용 정보부터 기업 분석, 포트폴리오 작성까지
              <br />
              IT 취업 준비를 위한 모든 것을 한 곳에서
            </p>
          </div>
          <img
            src={testImg}
            alt="메인 이미지"
            className="w-full max-w-md md:max-w-[368px]  h-auto rounded-2xl mt-6 md:mt-0"
          />
        </div>
      </section>

      {/* 채용 정보 */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        <h2 className="font-bold text-xl md:text-2xl mb-4">진행중인 채용</h2>
        <MainJobCard mockJobs={mockJobs} />
      </section>

      {/* 프로젝트 + 뉴스 */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 인기 프로젝트 - 2/3 너비 */}
          <div className="xl:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl md:text-2xl">인기 프로젝트</h2>
              <button className="text-sm md:text-base text-[#007DFC] font-semibold">
                더보기
              </button>
            </div>
            <MainProjectCard mockProjects={mockProjects} />
          </div>

          {/* 뉴스 - 1/3 너비 */}
          <div className="xl:col-span-1">
            <h2 className="font-bold text-xl md:text-2xl mb-4">뉴스</h2>
            <MainNewsCard mockNews={mockNews} />
          </div>
        </div>
      </section>

      {/* 주요 기능 소개 */}
      <section className="pb-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
          E:TCH의 주요 기능
        </h2>
        <MainFuncComponent funcData={funcData} />
      </section>
    </>
  );
}

export default MainPage;
