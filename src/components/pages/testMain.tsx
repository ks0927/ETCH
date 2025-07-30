import testImg from "../../assets/testImg.png";
import MainProjectCard from "../organisms/mainProjectCard";

function TestMain() {
  return (
    <>
      <section>
        <div className="bg-[#007DFC] h-114 flex ">
          <div className="flex items-center justify-between w-full text-white ms-9">
            <div>
              <div className="text-4xl font-bold">
                IT 취업의 모든 것
                <br />
                E:TCH에서 시작하세요
              </div>
              <div className="mt-3 text-1xl">
                채용 정보부터 기업 부석, 포트폴리오 작성까지
                <br />
                IT 취업 준비를 위한 모든 것을 한 곳에서
              </div>
            </div>
            <img
              src={testImg}
              alt="이미지"
              className="h-[368px] w-[568px] rounded-2xl me-9"
            />
          </div>
        </div>
      </section>
      <section>
        <h1 className="font-bold text-1xl">진행중인 채용</h1>
      </section>
      <div className="flex justify-start">
        <section>
          <h1 className="font-bold text-1xl">인기 프로젝트</h1>
          <MainProjectCard />
        </section>
        <section>
          <h1 className="font-bold text-1xl">뉴스</h1>
        </section>
      </div>
      <section>
        <h1 className="text-2xl font-bold">E:TCH의 주요 기능</h1>
      </section>
    </>
  );
}

export default TestMain;
