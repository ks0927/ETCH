import axios from "axios";
import { BASE_API } from "./BASE_API";
import type { ProjectCategoryEnum } from "../types/project/projectCategroyData";
import type { ProjectInputData } from "../types/project/projectDatas";

// 백엔드 요청 타입 (기존 유지)
export interface ProjectCreateRequestData {
  title: string;
  content: string;
  category: ProjectCategoryEnum;
  techCodeIds: number[];
  githubUrl?: string;
  youtubeUrl?: string;
  isPublic: boolean;
}

// 프로젝트 생성 API - ProjectInputData 사용
export async function createProject(projectInput: ProjectInputData) {
  try {
    const formData = new FormData();

    // 1. 프로젝트 데이터
    const requestData: ProjectCreateRequestData = {
      title: projectInput.title,
      content: projectInput.content,
      category: projectInput.projectCategory,
      techCodeIds: projectInput.techCodeIds,
      githubUrl: projectInput.githubUrl || undefined,
      youtubeUrl: projectInput.youtubeUrl || undefined,
      isPublic: projectInput.isPublic,
    };

    const dataBlob = new Blob([JSON.stringify(requestData)], {
      type: "application/json",
    });
    formData.append("data", dataBlob);

    // 2. 파일들
    if (projectInput.thumbnailFile) {
      formData.append("thumbnail", projectInput.thumbnailFile);
    }

    if (projectInput.imageFiles && projectInput.imageFiles.length > 0) {
      projectInput.imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    if (projectInput.pdfFile) {
      formData.append("pdf", projectInput.pdfFile);
    }

    // FormData 디버깅
    console.log("=== FormData 내용 확인 ===");
    console.log("requestData:", requestData);

    // FormData 내용 로깅
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axios.post(`${BASE_API}/projects`, formData, {
      // Content-Type 헤더 제거 (axios가 자동으로 설정하도록)
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });

    return response.data.data; // 프로젝트 ID 반환
  } catch (error) {
    console.error("프로젝트 생성 실패:", error);
    throw error;
  }
}

// 프로젝트 수정 API
export async function updateProject(
  projectId: number,
  projectInput: ProjectInputData
) {
  try {
    const formData = new FormData();

    // 1. 프로젝트 데이터 (수정용)
    const requestData = {
      title: projectInput.title,
      content: projectInput.content,
      category: projectInput.projectCategory,
      techCodeIds: projectInput.techCodeIds,
      githubUrl: projectInput.githubUrl || undefined,
      youtubeUrl: projectInput.youtubeUrl || undefined,
      isPublic: projectInput.isPublic,
      removeThumbnail: projectInput.removeThumbnail,
      removeFileIds: projectInput.removeFileIds,
      removePdf: projectInput.removePdf,
    };

    const dataBlob = new Blob([JSON.stringify(requestData)], {
      type: "application/json",
    });
    formData.append("data", dataBlob);

    // 2. 파일들
    if (projectInput.thumbnailFile) {
      formData.append("thumbnail", projectInput.thumbnailFile);
    }

    if (projectInput.imageFiles && projectInput.imageFiles.length > 0) {
      projectInput.imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    if (projectInput.pdfFile) {
      formData.append("pdf", projectInput.pdfFile);
    }

    const response = await axios.put(
      `${BASE_API}/projects/${projectId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("프로젝트 수정 실패:", error);
    throw error;
  }
}

// 프로젝트 삭제 API
// projectApi.tsx의 deleteProject 함수 수정
export async function deleteProject(projectId: number) {
  try {
    // 토큰 가져오기 (localStorage, sessionStorage, 쿠키 등에서)
    const token = localStorage.getItem("accessToken"); // 실제 토큰 저장 방식에 맞게 수정

    const response = await axios.delete(`${BASE_API}/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰 추가
      },
    });
    return response.data;
  } catch (error) {
    console.error("프로젝트 삭제 실패:", error);
    throw error;
  }
}

// 프로젝트 목록 조회 API
export async function getAllProjects() {
  try {
    const response = await axios.get(`${BASE_API}/projects`);
    console.log("백엔드 응답 원본:", response.data); // 전체 응답 구조
    console.log("프로젝트 데이터:", response.data.data); // 실제 프로젝트 배열
    console.log("첫 번째 프로젝트:", response.data.data[0]); // 개별 프로젝트 구조
    return response.data.data;
  } catch (error) {
    console.error("프로젝트 목록 조회 실패:", error);
    throw error;
  }
}

// 프로젝트 상세 조회 API
export async function getProjectById(id: number) {
  try {
    const response = await axios.get(`${BASE_API}/projects/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("프로젝트 상세 조회 실패:", error);
    throw error;
  }
}

// projectApi.tsx에 수정/추가
export async function likeProject(projectId: number) {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(
      `${BASE_API}/likes/projects`,
      {
        targetId: projectId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("좋아요 추가 실패:", error);
    throw error;
  }
}

export async function unlikeProject(projectId: number) {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.delete(
      `${BASE_API}/likes/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("좋아요 취소 실패:", error);
    throw error;
  }
}

// 내가 좋아요한 프로젝트 목록 조회 API 추가
export async function getLikedProjects() {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`${BASE_API}/likes/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("좋아요한 프로젝트 조회 실패:", error);
    throw error;
  }
}
export async function getMyProjects() {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`${BASE_API}/projects/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("내 프로젝트 조회 실패:", error);
    throw error;
  }
}
// projectApi.tsx에 추가할 함수 (권장)

// 특정 사용자의 공개 프로젝트만 조회하는 API
export async function getUserPublicProjects(userId: number) {
  try {
    const response = await axios.get(
      `${BASE_API}/projects/user/${userId}/public`
    );
    console.log("사용자 공개 프로젝트:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("사용자 공개 프로젝트 조회 실패:", error);
    throw error;
  }
}

// 또는 쿼리 파라미터 방식
export async function getUserProjects(
  userId: number,
  isPublicOnly: boolean = false
) {
  try {
    const params = new URLSearchParams();
    params.append("userId", userId.toString());
    if (isPublicOnly) {
      params.append("isPublic", "true");
    }

    const response = await axios.get(
      `${BASE_API}/projects?${params.toString()}`
    );
    console.log("사용자 프로젝트:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("사용자 프로젝트 조회 실패:", error);
    throw error;
  }
}
