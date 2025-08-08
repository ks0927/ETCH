import { useState } from "react";
import TabToggle from "../../molecules/mypage/tabToggle";
import DocumentItem from "../../molecules/mypage/documentItem";
import type { MockDocumentItem } from "../../../types/mock/mockDocumentsData";

interface MyDocumentsProps {
  coverLetters: MockDocumentItem[];
  portfolios: MockDocumentItem[];
}

const MyDocuments = ({ coverLetters, portfolios }: MyDocumentsProps) => {
  const [currentTab, setCurrentTab] = useState<"coverLetter" | "portfolio">(
    "coverLetter"
  );

  const currentDocuments =
    currentTab === "coverLetter" ? coverLetters : portfolios;

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
          {currentDocuments.map((doc) => (
            <DocumentItem
              key={doc.id}
              id={doc.id.toString()}
              title={doc.title}
              date={doc.date}
              onClick={(id) => console.log(`Document ${id} clicked`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;
