import type { mockNewsData } from "../../../types/mockNewsData";
import RecommendCard from "../../molecules/news/recommendList";
interface Props {
  newsData: mockNewsData[];
}

function AllRecommendNews({ newsData }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {newsData.map((news, index) => (
        <RecommendCard key={news.id || index} type="news" {...news} />
      ))}
    </div>
  );
}

export default AllRecommendNews;
