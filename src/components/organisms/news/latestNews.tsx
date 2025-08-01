import type { mockNewsData } from "../../../types/mockNewsData";
import LatestCard from "../../molecules/news/latestCard";
interface Props {
  newsData: mockNewsData[];
}

function LatestNews({ newsData }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {newsData.slice(0, 4).map((news) => (
        <LatestCard type="news" {...news} />
      ))}
    </div>
  );
}

export default LatestNews;
