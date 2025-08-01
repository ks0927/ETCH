import type { funcComponentData } from "../../../types/funcComponentData";
import FuncComponent from "../../molecules/main/funcComponent";

interface Props {
  funcData: funcComponentData[];
}

function MainFuncComponent({ funcData }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {funcData.slice(0, 4).map((item) => (
        <FuncComponent {...item} />
      ))}
    </div>
  );
}

export default MainFuncComponent;
