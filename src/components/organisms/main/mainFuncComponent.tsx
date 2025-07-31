import type { funcComponentData } from "../../../types/funcComponentData";
import FuncComponent from "../../molecules/main/funcComponent";

interface Props {
  funcData: funcComponentData[];
}

function MainFuncComponent({ funcData }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {funcData.slice(0, 4).map((item) => (
        <FuncComponent
          key={item.title} // 고유값이 있다면 id 등으로 바꾸는 게 더 안전함
          title={item.title}
          img={item.img}
          content={item.content}
        />
      ))}
    </div>
  );
}

export default MainFuncComponent;
