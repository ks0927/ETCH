import type { mockNewsData } from "../../../types/mockNewsData";
import RecommendCard from "../../molecules/news/recommendCard";
interface Props {
  newsData: mockNewsData[];
}

function RecommendNews({ newsData }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {newsData.slice(0, 4).map((news) => (
        <RecommendCard type="news" {...news} />
      ))}
    </div>
  );
}

export default RecommendNews;
