import type { News } from "../../../types/newsTypes";
import LatestCard from "../../molecules/news/latestList";

interface Props {
  newsData: News[];
}

function LatestNews({ newsData }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {newsData.slice(0, 8).map((news) => {
        // index 제거
        // 각 뉴스 항목 검증
        if (!news || !news.id) {
          return null;
        }

        return <LatestCard key={news.id} type="news" {...news} />;
      })}
    </div>
  );
}

export default LatestNews;
