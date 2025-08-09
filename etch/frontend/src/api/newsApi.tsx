import axios from "axios";
import { BASE_API } from "./BASE_API";
import type { ProjectData } from "../types/project/projectDatas";
import type { ProjectCategoryEnum } from "../types/project/projectCategroyData";

// 프로젝트 생성 응답 타입 (서버에서 받는 데이터)
export interface ProjectResponse
  extends Omit<ProjectData, "category" | "uploadedFiles"> {
  id: number;
  category: ProjectCategoryEnum; // 빈 문자열이 아닌 실제 카테고리
  fileUrls: string[]; // File[] 대신 URL 문자열 배열
  createdAt: string;
  updatedAt: string;
}

// 프로젝트 생성
export async function createProject(projectData: ProjectData) {
  const formData = new FormData();

  formData.append("title", projectData.title);
  formData.append("content", projectData.content);
  formData.append("githubUrl", projectData.githubUrl);
  formData.append("category", projectData.category);
  formData.append("isPublic", projectData.isPublic.toString());
  formData.append("stack", JSON.stringify(projectData.stack));

  projectData.uploadedFiles.forEach((file) => {
    formData.append("files", file);
  });

  const res = await axios.post(`${BASE_API}/projects`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
}

// 프로젝트 목록 조회
export async function getProjects(
  page = 1,
  limit = 10,
  category?: ProjectCategoryEnum
) {
  const params: {
    page: number;
    limit: number;
    category?: ProjectCategoryEnum;
  } = { page, limit };

  if (category) {
    params.category = category;
  }

  const res = await axios.get(`${BASE_API}/projects`, { params });
  return res.data.data;
}

// 프로젝트 상세 조회
export async function getProjectById(id: number) {
  const res = await axios.get(`${BASE_API}/projects/${id}`);
  return res.data.data;
}

// 프로젝트 삭제
export async function deleteProject(id: number) {
  const res = await axios.delete(`${BASE_API}/projects/${id}`);
  return res.data;
}
