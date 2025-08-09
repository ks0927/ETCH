import type { TextCard } from "../../atoms/textCard";
import PortfolioLicenseForm from "../../molecules/portfolio/portfolioLicenseForm";
import PortfolioLicenseTextCard from "../../molecules/portfolio/portfolioLicenseTextCard";
import PortfolioActivityTextCard from "../../molecules/portfolio/portfolioActivityTextCart";
import type {
  Activity,
  License,
  PortfolioProject,
} from "../../../types/portfolio/portfolioDatas";
import PortfolioProjectForm from "../../molecules/portfolio/portfolioProjectForm";
import PortfolioProjectTextCard from "../../molecules/portfolio/portfolioProjectTextCart";
import PortfolioActivityForm from "../../molecules/portfolio/portfolioActivityForm";

function PortfolioWriteTextCard({
  title,
  type,
  projects,
  activities,
  licenses,
  onProjectAdd,
  onActivityAdd,
  onLicenseAdd,
  onProjectRemove,
  onActivityRemove,
  onLicenseRemove,
}: TextCard & {
  projects?: PortfolioProject[];
  activities?: Activity[];
  licenses?: License[];
  onProjectAdd?: (projects: PortfolioProject) => void; // typo 수정: proejcts -> projects
  onProjectRemove?: (index: number) => void;
  onActivityAdd?: (activity: Activity) => void;
  onLicenseAdd?: (license: License) => void;
  onActivityRemove?: (index: number) => void;
  onLicenseRemove?: (index: number) => void;
}) {
  const renderContent = () => {
    switch (type) {
      case "project":
        return (
          <div className="space-y-6">
            {/* PortfolioProjectForm에는 onSubmit만 전달 */}
            <PortfolioProjectForm onSubmit={onProjectAdd || (() => {})} />
            {/* PortfolioProjectTextCard에는 projects와 onRemove 전달 */}
            <PortfolioProjectTextCard
              projects={projects || []}
              onRemove={onProjectRemove}
            />
          </div>
        );
      case "activity":
        return (
          <div className="space-y-6">
            {/* PortfolioActivityForm에는 onSubmit만 전달 */}
            <PortfolioActivityForm onSubmit={onActivityAdd || (() => {})} />
            {/* PortfolioActivityTextCard에는 activities와 onRemove 전달 */}
            <PortfolioActivityTextCard
              activities={activities || []}
              onRemove={onActivityRemove}
            />
          </div>
        );
      case "license":
        return (
          <div className="space-y-6">
            {/* PortfolioLicenseForm에는 onSubmit만 전달 */}
            <PortfolioLicenseForm onSubmit={onLicenseAdd || (() => {})} />
            {/* PortfolioLicenseTextCard에는 licenses와 onRemove 전달 */}
            <PortfolioLicenseTextCard
              licenses={licenses || []}
              onRemove={onLicenseRemove}
            />
          </div>
        );
      default:
        return <div>잘못된 오류입니다.</div>;
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 pb-2 border-b">{title}</h2>
      {renderContent()}
    </div>
  );
}

export default PortfolioWriteTextCard;
