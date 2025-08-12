import type { News } from "../../../types/newsTypes";
import NewsCard from "../../molecules/home/newsCard";

interface Props {
  newsData: News[];
}

function HomeNewsCard({ newsData }: Props) {
  return (
    <div className="space-y-3">
      {newsData.slice(0, 5).map((news) => (
        <NewsCard key={news.id} {...news} type="news" />
      ))}
    </div>
  );
}

export default HomeNewsCard;
