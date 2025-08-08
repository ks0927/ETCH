type category = "field" | "stack" | "sort";

export interface ProjectSidebarInventory {
  type: category;
  list: string;
  value: string;
  checked: boolean;
}

export const ProjectSidebarType: ProjectSidebarInventory[] = [
  //field

  {
    type: "field",
    list: "웹 개발",
    value: "웹 개발",
    checked: false,
  },
  {
    type: "field",
    list: "모바일 앱",
    value: "모바일 앱",
    checked: false,
  },
  {
    type: "field",
    list: "서버",
    value: "서버",
    checked: false,
  },
  {
    type: "field",
    list: "데이터베이스",
    value: "데이터베이스",
    checked: false,
  },
  {
    type: "field",
    list: "DevOps",
    value: "DevOps",
    checked: false,
  },

  {
    type: "field",
    list: "보안",
    value: "보안",
    checked: false,
  },
  //stack
  {
    type: "stack",
    list: "React",
    value: "React",
    checked: false,
  },
  {
    type: "stack",
    list: "Vue.js",
    value: "Vue.js",
    checked: false,
  },
  {
    type: "stack",
    list: "Node.js",
    value: "Node.js",
    checked: false,
  },
  {
    type: "stack",
    list: "Python",
    value: "Python",
    checked: false,
  },
  {
    type: "stack",
    list: "Java",
    value: "Java",
    checked: false,
  },
  {
    type: "stack",
    list: "Spring",
    value: "Spring",
    checked: false,
  },
  {
    type: "stack",
    list: "Flutter",
    value: "Flutter",
    checked: false,
  },
  {
    type: "stack",
    list: "Docker",
    value: "Docker",
    checked: false,
  },
  //sort
  {
    type: "sort",
    list: "인기순",
    value: "인기순",
    checked: false,
  },
  {
    type: "sort",
    list: "최신순",
    value: "최신순",
    checked: false,
  },
  {
    type: "sort",
    list: "조회순",
    value: "조회순",
    checked: false,
  },
];
