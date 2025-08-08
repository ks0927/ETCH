import { useState } from "react";
import { useNavigate } from "react-router";
import CoverLetterInfoSection from "../../molecules/mypage/coverLetterInfoSection";
import QuestionList from "../../organisms/mypage/questionList";
import { mockQuestions } from "../../../types/mock/mockQuestionData";
import CoverLetterActions from "../../organisms/mypage/coverLetterActions";

function MyPageCoverLetterCreatePage() {
  const navigate = useNavigate();
  const [coverLetterName, setCoverLetterName] = useState("");
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleCancel = () => {
    navigate(-1); // 뒤로가기
  };

  const handleSubmit = () => {
    console.log("자기소개서 생성:", { coverLetterName, answers });
    // 추후 API 호출 등 기능 구현
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">📄</span>
          <span className="text-xl font-semibold">자기소개서 작성</span>
        </div>
      </div>

      <CoverLetterInfoSection
        value={coverLetterName}
        type="text"
        placeholder="예: 네이버 백엔드 개발자 지원서"
        onChange={setCoverLetterName}
      />
      <QuestionList
        questions={mockQuestions}
        answers={answers}
        onAnswerChange={handleAnswerChange}
      />
      <CoverLetterActions onCancel={handleCancel} onSubmit={handleSubmit} />
    </div>
  );
}

export default MyPageCoverLetterCreatePage;
