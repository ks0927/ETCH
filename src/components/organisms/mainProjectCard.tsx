import ProjectCard from "../molecules/projectCard.tsx";
import TestImg from "../../assets/testImg.png";

interface mockData {
  id: number;
  title: string;
  content: string;
  img: string;
}

function MainProjectCard() {
  const test: mockData = {
    id: 1,
    title: "Test Title",
    content: "Test Content",
    img: TestImg,
  };

  return (
    <>
      <ProjectCard
        type="project"
        img={test.img}
        id={test.id}
        title={test.title}
        content={test.content}
      />
    </>
  );
}

export default MainProjectCard;
