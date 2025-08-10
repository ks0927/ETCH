import type { JobItemProps } from "../../atoms/listItem";

interface JobDetailTabContentProps {
  activeTab: "details" | "company" | "news";
  job: JobItemProps;
}

export default function JobDetailTabContent({ activeTab, job }: JobDetailTabContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div>
            <h3>공고 상세</h3>
            <p>회사: {job.company}</p>
            <p>위치: {job.location}</p>
            <p>시작일: {job.opening_date}</p>
            <p>마감일: {job.expiration_date}</p>
          </div>
        );
      case "company":
        return (
          <div>
            <h3>기업 정보</h3>
            <p>회사명: {job.company}</p>
            <p>위치: {job.location}</p>
            <p>기업 설명이 들어갈 자리</p>
          </div>
        );
      case "news":
        return (
          <div>
            <h3>기업 뉴스</h3>
            <p>{job.company} 관련 뉴스가 들어갈 자리</p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
}