import { useState } from "react";
import TabToggle from "../../molecules/mypage/tabToggle";
import DocumentItem from "../../molecules/mypage/documentItem";
import { useNavigate } from "react-router";

import type { CoverLetterListResponse } from "../../../types/coverLetter";
import { deleteCoverLetter } from "../../../api/coverLetterApi";
import { deletePortfolio } from "../../../api/portfolioApi";

// 포트폴리오 목록 타입 정의 (API에서 반환되는 타입과 일치)
interface PortfolioListItem {
  id: number;
  introduce: string;
  updatedAt: string;
  name?: string;
}

// 공통 문서 인터페이스 (DocumentItem에서 사용할 형태)
interface DocumentDisplayItem {
  id: number;
  displayText: string;
  updatedAt: string;
}

interface MyDocumentsProps {
  coverLetters: CoverLetterListResponse[];
  portfolios: PortfolioListItem[];
  refetchCoverLetters: () => void;
  refetchPortfolios?: () => void;
}

const MyDocuments = ({
  coverLetters,
  portfolios,
  refetchCoverLetters,
  refetchPortfolios,
}: MyDocumentsProps) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<"coverLetter" | "portfolio">(
    "coverLetter"
  );

  // CoverLetterListResponse를 DocumentDisplayItem으로 변환하는 함수
  const convertCoverLetterToDisplayItem = (
    coverLetter: CoverLetterListResponse
  ): DocumentDisplayItem => {
    // CoverLetterListResponse의 실제 필드를 타입 안전하게 확인
    const hasTitle = "title" in coverLetter;
    const hasSubject = "subject" in coverLetter;
    const hasContent = "content" in coverLetter;
    const hasUpdatedAt = "updatedAt" in coverLetter;
    const hasModifiedAt = "modifiedAt" in coverLetter;
    const hasCreatedAt = "createdAt" in coverLetter;

    let displayText = "제목 없음";
    if (hasTitle) {
      displayText = (coverLetter as { title: string }).title;
    } else if (hasSubject) {
      displayText = (coverLetter as { subject: string }).subject;
    } else if (hasContent) {
      displayText = (coverLetter as { content: string }).content;
    }

    let updatedAt = "";
    if (hasUpdatedAt) {
      updatedAt = (coverLetter as { updatedAt: string }).updatedAt;
    } else if (hasModifiedAt) {
      updatedAt = (coverLetter as { modifiedAt: string }).modifiedAt;
    } else if (hasCreatedAt) {
      updatedAt = (coverLetter as { createdAt: string }).createdAt;
    }

    return {
      id: coverLetter.id,
      displayText,
      updatedAt,
    };
  };

  // PortfolioListItem을 DocumentDisplayItem으로 변환하는 함수
  const convertPortfolioToDisplayItem = (
    portfolio: PortfolioListItem
  ): DocumentDisplayItem => {
    return {
      id: portfolio.id,
      displayText: portfolio.introduce,
      updatedAt: portfolio.updatedAt,
    };
  };

  // 현재 탭에 따라 문서들을 DocumentDisplayItem 형태로 변환
  const currentDocuments: DocumentDisplayItem[] =
    currentTab === "coverLetter"
      ? coverLetters.map(convertCoverLetterToDisplayItem)
      : portfolios.map(convertPortfolioToDisplayItem);

  const handleDelete = async (id: string) => {
    if (currentTab === "coverLetter") {
      const confirmDelete = window.confirm(
        "정말로 이 자기소개서를 삭제하시겠습니까?"
      );
      if (confirmDelete) {
        try {
          await deleteCoverLetter(Number(id));
          alert("자기소개서가 성공적으로 삭제되었습니다.");
          refetchCoverLetters();
        } catch (error) {
          console.error("자기소개서 삭제 실패:", error);
          alert("자기소개서 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      }
    } else {
      const confirmDelete = window.confirm(
        "정말로 이 포트폴리오를 삭제하시겠습니까?"
      );
      if (confirmDelete) {
        try {
          await deletePortfolio(Number(id));
          alert("포트폴리오가 성공적으로 삭제되었습니다.");
          refetchPortfolios?.();
        } catch (error) {
          console.error("포트폴리오 삭제 실패:", error);
          alert("포트폴리오 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      }
    }
  };

  const handleDocumentClick = (id: string) => {
    if (currentTab === "coverLetter") {
      navigate(`/mypage/cover-letter-detail/${id}`);
    } else {
      console.log(`View portfolio detail with ID: ${id}`);
      alert("포트폴리오 상세 보기 기능은 아직 구현되지 않았습니다.");
    }
  };

  const handleEditClick = (id: string) => {
    if (currentTab === "coverLetter") {
      navigate(`/mypage/cover-letter-edit/${id}`);
    } else {
      navigate(`/mypage/portfolio/${id}`);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <h3 className="text-lg font-semibold">내 문서</h3>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <TabToggle currentTab={currentTab} onTabChange={setCurrentTab} />
        </div>

        <div className="space-y-3">
          {currentDocuments.length > 0 ? (
            currentDocuments.map((doc) => (
              <DocumentItem
                key={doc.id}
                id={doc.id.toString()}
                introduce={doc.displayText}
                updatedAt={doc.updatedAt}
                onClick={handleDocumentClick}
                onDelete={handleDelete}
                onEdit={handleEditClick}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              {currentTab === "coverLetter"
                ? "작성된 자기소개서가 없습니다."
                : "작성된 포트폴리오가 없습니다."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;
