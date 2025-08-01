import type { FuncComponentProps } from "../../atoms/funcComponent";

function FuncComponent({ title, content, img }: FuncComponentProps) {
  return (
    <div className="h-50 ">
      <section className="flex justify-center pb-4">
        <img src={img} alt="기능 이미지" className="h-8 " />
      </section>
      <section className="flex justify-center pb-2">
        <div className="text-2xl font-bold">{title}</div>
      </section>
      <section>
        <div className="text-gray-500 text-center">{content}</div>
      </section>
    </div>
  );
}

export default FuncComponent;
