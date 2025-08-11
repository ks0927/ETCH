import axios from "axios";
import { BASE_API } from "./BASE_API";
import type { ProjectCategoryEnum } from "../types/project/projectCategroyData";
import type { ProjectData } from "../types/project/projectDatas";

// 프로젝트 생성 요청 데이터 타입 (백엔드 DTO에 맞춤)
export interface ProjectCreateRequestData {
  title: string;
  content: string;
  category: ProjectCategoryEnum;
  youtubeUrl?: string;
  githubUrl?: string;
  isPublic: boolean;
  techStacks: string[]; // ProjectTechEnum[]을 string[]로 변환
}

// 프로젝트 생성 API
export async function createProject(
  projectData: ProjectData,
  thumbnailFile?: File,
  imageFiles?: File[],
  pdfFile?: File
) {
  try {
    const formData = new FormData();

    // 1. 프로젝트 데이터 JSON으로 변환하여 추가
    const requestData: ProjectCreateRequestData = {
      title: projectData.title,
      content: projectData.content,
      category: projectData.category as ProjectCategoryEnum,
      youtubeUrl: projectData.youtubeUrl || undefined,
      githubUrl: projectData.githubUrl || undefined,
      isPublic: projectData.isPublic,
      techStacks: projectData.projectTechs.map((tech) => tech.toString()),
    };

    // JSON 데이터를 Blob으로 변환하여 추가
    const dataBlob = new Blob([JSON.stringify(requestData)], {
      type: "application/json",
    });
    formData.append("data", dataBlob);

    // 2. 썸네일 파일 추가 (선택적)
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    // 3. 이미지 파일들 추가 (선택적)
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    // 4. PDF 파일 추가 (선택적)
    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    const response = await axios.post(`${BASE_API}/projects`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data; // 생성된 프로젝트 ID 반환
  } catch (error) {
    console.error("프로젝트 생성 실패:", error);
    throw error;
  }
}

// 파일 타입별로 분류하는 유틸리티 함수
export function categorizeFiles(files: File[]) {
  let thumbnailFile: File | undefined;
  const imageFiles: File[] = [];
  let pdfFile: File | undefined;

  files.forEach((file, index) => {
    if (file.type.startsWith("image/")) {
      if (index === 0) {
        // 첫 번째 이미지를 썸네일로 설정
        thumbnailFile = file;
      } else {
        // 나머지 이미지들
        imageFiles.push(file);
      }
    } else if (file.type === "application/pdf") {
      pdfFile = file;
    }
  });

  return { thumbnailFile, imageFiles, pdfFile };
}

// 프로젝트 생성 (파일 자동 분류 포함)
export async function createProjectWithFiles(projectData: ProjectData) {
  const { thumbnailFile, imageFiles, pdfFile } = categorizeFiles(
    projectData.files
  );

  return await createProject(projectData, thumbnailFile, imageFiles, pdfFile);
}

// 프로젝트 목록 조회 API
export async function getAllProjects() {
  const response = await axios.get(`${BASE_API}/projects`);
  return response.data.data;
}

// 프로젝트 상세 조회 API
export async function getProjectById(id: number) {
  const response = await axios.get(`${BASE_API}/projects/${id}`);
  return response.data.data;
}
