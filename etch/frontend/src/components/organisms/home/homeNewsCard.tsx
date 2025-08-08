import type { News } from "../../../types/news";
import NewsCard from "../../molecules/home/newsCard";

interface Props {
  newsData: News[];
}

function HomeNewsCard({ newsData }: Props) {
  return (
    <div className="space-y-3">
      {newsData.slice(0, 5).map((news) => (
        <NewsCard {...news} type="news" />
      ))}
    </div>
  );
}

export default HomeNewsCard;
