import type { PortfolioStackEnum } from "./portfolioStack";

export interface portfolioDatas {
  name: string;
  phoneNumber: string;
  email: string;
  githubUrl: string;
  intro: string;
  stack: PortfolioStackEnum[];

  licenses: License[];
  projects: PortfolioProject[];
  activities: Activity[];
}

// 초기 상태값
export const PortfolioState: portfolioDatas = {
  name: "",
  phoneNumber: "",
  email: "",
  githubUrl: "",
  intro: "",
  stack: [],

  // 프로젝트
  projects: [],

  //교육 / 수료 등등
  activities: [],
  // 자격증
  licenses: [],
};

export interface PortfolioProject {
  projectName: string;
  comment: string;
  content: string;
  stack: Array<{ value: string; label: string }>;
  startAt: string;
  endAt: string;
  githubURL: string;
}

export const PortfolioProjectState: PortfolioProject = {
  projectName: "",
  comment: "",
  content: "",
  stack: [],
  startAt: "",
  endAt: "",
  githubURL: "",
};

export interface Activity {
  companyName: string;
  startAt: string;
  endAt: string;
  active: string;
}
export const ActivityState: Activity = {
  companyName: "",
  startAt: "",
  endAt: "",
  active: "",
};

export interface License {
  licenseName: string;
  getAt: string;
  issuer: string; //발급처
}

export const LicenseState: License = {
  licenseName: "",
  getAt: "",
  issuer: "",
};
