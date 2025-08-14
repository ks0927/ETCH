import type { TextCard } from "../../atoms/textCard";
import PortfolioLangugaeForm from "../../molecules/portfolio/portfolioLicenseForm";
import PortfolioLanguageTextCard from "../../molecules/portfolio/portfolioLicenseTextCard";
import PortfolioEducationTextCard from "../../molecules/portfolio/portfolioActivityTextCart";
import type {
  education,
  language,
} from "../../../types/portfolio/portfolioDatas";
import PortfolioEducationForm from "../../molecules/portfolio/portfolioActivityForm";

function PortfolioWriteTextCard({
  title,
  type,
  education,
  language,
  onEducationAdd,
  onLanguageAdd,
  onEducationRemove: onActivityRemove,
  onLanguageRemove: onLicenseRemove,
  showForm,
  onToggleForm,
}: TextCard & {
  education?: education[];
  language?: language[];
  onEducationAdd?: (education: string) => void;
  onLanguageAdd?: (language: string) => void;
  onEducationRemove?: (index: number) => void;
  onLanguageRemove?: (index: number) => void;
  showForm?: boolean;
  onToggleForm?: () => void;
}) {
  // 객체를 문자열로 변환하는 핸들러들
  const handleEducationSubmit = (data: education) => {
    if (onEducationAdd) {
      const educationString = `${data.companyName}^${data.active}^${data.startAt}^${data.endAt}`;
      onEducationAdd(educationString);
    }
  };

  const handleLanguageSubmit = (data: language) => {
    if (onLanguageAdd) {
      const languageString = `${data.licenseName}^${data.issuer}^${data.getAt}`;
      onLanguageAdd(languageString);
    }
  };

  const renderContent = () => {
    switch (type) {
      case "education":
        return (
          <div className="space-y-6">
            {showForm && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <PortfolioEducationForm onSubmit={handleEducationSubmit} />
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => onToggleForm?.()}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
            <PortfolioEducationTextCard
              education={education || []}
              onRemove={onActivityRemove}
            />
          </div>
        );
      case "language":
        return (
          <div className="space-y-6">
            {showForm && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <PortfolioLangugaeForm onSubmit={handleLanguageSubmit} />
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => onToggleForm?.()}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
            <PortfolioLanguageTextCard
              language={language || []}
              onRemove={onLicenseRemove}
            />
          </div>
        );
      default:
        return <div>잘못된 타입입니다.</div>;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={() => onToggleForm?.()}
          className="flex items-center justify-center px-4 py-2 text-sm font-semibold transition-all duration-200 rounded cursor-pointer hover:brightness-90 border border-gray-300"
        >
          {showForm ? "추가 -" : "추가 +"}
        </button>
      </div>
      <div className="border-b pb-2 mb-4"></div>
      {renderContent()}
    </div>
  );
}

export default PortfolioWriteTextCard;
