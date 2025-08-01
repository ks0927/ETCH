import type { mockNewsData } from "../../../types/mockNewsData";
import NewsCard from "../../molecules/home/newsCard";

interface Props {
  mockNews: mockNewsData[];
}

function MainNewsCard({ mockNews }: Props) {
  return (
    <div className="space-y-3">
      {mockNews.slice(0, 5).map((news) => (
        <NewsCard {...news} type="news" />
      ))}
    </div>
  );
}

export default MainNewsCard;
