import { useState } from "react";
import type { ProjectSidebarInventory } from "../../../../types/projectSidebarType";
import ProjectSidebar from "../../../molecules/project/projectSidebar";

interface Props {
  ProjectSidebarType: ProjectSidebarInventory[];
}

function ProjectListSidebar({ ProjectSidebarType }: Props) {
  const [sidebarData, setSidebarData] =
    useState<ProjectSidebarInventory[]>(ProjectSidebarType);

  // ProjectProjectSidebar 수정
  const handleChange = (checked: boolean, value: string) => {
    setSidebarData((prevData) =>
      prevData.map((item) =>
        item.value === value ? { ...item, checked: checked } : item
      )
    );
  };

  const handleSortChange = (checked: boolean, value: string) => {
    if (checked) {
      setSidebarData((prevData) =>
        prevData.map((item) =>
          item.type === "sort"
            ? { ...item, checked: item.value === value } // 선택된 것만 true, 나머지는 false
            : item
        )
      );
    }
  };

  return (
    <>
      <ProjectSidebar
        sidebarData={sidebarData}
        onChange={handleChange}
        onSortChange={handleSortChange} // 정렬용 함수 추가
      />
    </>
  );
}

export default ProjectListSidebar;
