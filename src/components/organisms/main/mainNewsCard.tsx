import type { mockNewsData } from "../../../types/mockNewsData";
import NewsCard from "../../molecules/main/newsCard";

interface Props {
  mockNews: mockNewsData[];
}

function MainNewsCard({ mockNews }: Props) {
  return (
    <div className="space-y-3">
      {mockNews.slice(0, 5).map((news) => (
        <NewsCard
          key={news.id}
          id={news.id}
          createTime={news.createTime}
          title={news.title}
          company={news.company}
          type="news"
        />
      ))}
    </div>
  );
}

export default MainNewsCard;
