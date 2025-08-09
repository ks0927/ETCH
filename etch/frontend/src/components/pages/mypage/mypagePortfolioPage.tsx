import { useState } from "react";
import {
  PortfolioWriteStackData,
  type PortfolioStackEnum,
} from "../../../types/portfolio/portfolioStack";
import {
  PortfolioState,
  type Activity,
  type License,
  type portfolioDatas,
  type PortfolioProject,
} from "../../../types/portfolio/portfolioDatas";
import PortfolioWriteInput from "../../organisms/portfolio/portfolioWriteInput";
import PortfolioWriteTextCard from "../../organisms/portfolio/portfolioTextCard";
import PortfolioSubmitButton from "../../organisms/portfolio/portfolioSubmitButton";
import PortfolioStackSelect from "../../organisms/portfolio/portfolioStackSelect";

function MypagePortfolioPage() {
  const [portfolioData, setPortfolioData] = useState<portfolioDatas>({
    ...PortfolioState,
    stack: [] as PortfolioStackEnum[], // 배열로 명시적 타이핑
  });

  // ============== 기본 정보 핸들러들 ==============

  const handleStacksChange = (stack: PortfolioStackEnum) => {
    setPortfolioData((prev) => {
      const currentStacks = prev.stack;
      const isSelected = currentStacks.includes(stack);

      let newStacks;
      if (isSelected) {
        // 이미 선택된 스택이면 제거
        newStacks = currentStacks.filter((s) => s !== stack);
      } else {
        // 선택되지 않은 스택이면 추가
        newStacks = [...currentStacks, stack];
      }

      console.log("현재 스택들 : ", newStacks);

      return {
        ...prev,
        stack: newStacks,
      };
    });
  };

  const handleNameChange = (value: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      name: value,
    }));
    console.log("현재 이름 : ", value);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
    console.log("현재 휴대폰 번호 : ", value);
  };

  const handleEmailChange = (value: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      email: value,
    }));
    console.log("현재 이메일 주소 : ", value);
  };

  const handleGithubUrlChange = (value: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      githubUrl: value,
    }));
    console.log("현재 깃허브 주소 : ", value);
  };

  const handleIntroChange = (value: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      intro: value,
    }));
    console.log("현재 자기소개 : ", value);
  };

  // ============== 활동/자격증 핸들러들 ==============

  const handleProjectAdd = (project: PortfolioProject) => {
    setPortfolioData((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
    console.log("프로젝트 추가됨 : ", project);
  };
  const handleProjectRemove = (index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
    console.log("프로젝트 삭제됨, 인덱스 : ", index);
  };

  const handleActivityAdd = (activity: Activity) => {
    setPortfolioData((prev) => ({
      ...prev,
      activities: [...prev.activities, activity],
    }));
    console.log("활동 추가됨 : ", activity);
  };

  const handleLicenseAdd = (license: License) => {
    setPortfolioData((prev) => ({
      ...prev,
      licenses: [...prev.licenses, license],
    }));
    console.log("자격증 추가됨 : ", license);
  };

  const handleActivityRemove = (index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
    console.log("활동 삭제됨, 인덱스 : ", index);
  };

  const handleLicenseRemove = (index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      licenses: prev.licenses.filter((_, i) => i !== index),
    }));
    console.log("자격증 삭제됨, 인덱스 : ", index);
  };

  const handleSubmit = async () => {
    try {
      // API 호출 로직
      console.log("제출할 데이터:", portfolioData);

      // 실제 API 호출
      // const response = await createProject(projectData);

      // 성공 처리
    } catch (error) {
      // 에러 처리
      console.error("프로젝트 생성 실패:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">포트폴리오 작성</h1>

      {/* 기본 정보 섹션 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">기본 정보</h2>

        <PortfolioWriteInput
          inputText="이름"
          placeholderText="홍길동"
          type="text"
          value={portfolioData.name}
          onChange={handleNameChange}
        />

        <PortfolioWriteInput
          inputText="연락처"
          placeholderText="010-1234-5678"
          type="tel"
          value={portfolioData.phoneNumber}
          onChange={handlePhoneNumberChange}
        />

        <PortfolioWriteInput
          inputText="이메일"
          placeholderText="etch@example.com"
          type="email"
          value={portfolioData.email}
          onChange={handleEmailChange}
        />

        <PortfolioWriteInput
          inputText="GitHub"
          placeholderText="http://github.com/username/repository"
          type="url"
          value={portfolioData.githubUrl}
          onChange={handleGithubUrlChange}
        />

        <PortfolioWriteInput
          inputText="한 줄 자기소개"
          placeholderText="안녕하세요, 열정과 패기로 준비된 신입 개발자 홍길동입니다."
          type="text"
          value={portfolioData.intro}
          onChange={handleIntroChange}
        />
      </div>

      {/* 기술 스택 섹션 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">보유 기술 스택</h2>
        <PortfolioStackSelect
          isStackData={PortfolioWriteStackData}
          isSelect={portfolioData.stack}
          onStackChange={handleStacksChange}
        />
      </div>

      {/* 프로젝트 섹션 */}
      <PortfolioWriteTextCard
        title="프로젝트 경험"
        type="project"
        projects={portfolioData.projects}
        onProjectAdd={handleProjectAdd}
        onProjectRemove={handleProjectRemove}
      />

      {/* 활동 섹션 */}
      <PortfolioWriteTextCard
        title="교육 / 수료 / 활동"
        type="activity"
        activities={portfolioData.activities}
        onActivityAdd={handleActivityAdd}
        onActivityRemove={handleActivityRemove}
      />

      {/* 자격증 섹션 */}
      <PortfolioWriteTextCard
        title="자격증 및 어학"
        type="license"
        licenses={portfolioData.licenses}
        onLicenseAdd={handleLicenseAdd}
        onLicenseRemove={handleLicenseRemove}
      />

      <PortfolioSubmitButton
        onSubmit={handleSubmit}
        isDisabled={
          !portfolioData.name ||
          !portfolioData.phoneNumber ||
          !portfolioData.intro
        }
      />
    </div>
  );
}

export default MypagePortfolioPage;
