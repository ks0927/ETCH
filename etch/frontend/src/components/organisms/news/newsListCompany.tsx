import type { mockCompanyData } from "../../../types/mock/mockCompanyData";
import CompanyCard from "../../molecules/news/companyCard";

interface Props {
  companyData: mockCompanyData[];
}

function CompanyNews({ companyData }: Props) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {companyData.slice(0, 4).map((company, index) => (
        <CompanyCard
          key={company.companyName || index}
          {...company}
          type="company"
        />
      ))}
    </div>
  );
}

export default CompanyNews;
