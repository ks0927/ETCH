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
// projectApi.tsx - 모든 API 함수에서 토큰 키 수정
export async function deleteProject(projectId: number) {
  try {
    // accessToken → access_token으로 변경
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const response = await axios.delete(`${BASE_API}/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token"); // 키 이름 수정
        throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
      } else if (error.response?.status === 403) {
        throw new Error("삭제 권한이 없습니다.");
      } else if (error.response?.status === 404) {
        throw new Error("삭제할 프로젝트를 찾을 수 없습니다.");
      }
    }
    console.error("프로젝트 삭제 실패:", error);
    throw error;
  }
}

export async function likeProject(projectId: number) {
  try {
    const token = localStorage.getItem("access_token"); // 키 이름 수정

    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

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
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token"); // 키 이름 수정
        throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
      }
    }
    console.error("좋아요 추가 실패:", error);
    throw error;
  }
}

export async function unlikeProject(projectId: number) {
  try {
    const token = localStorage.getItem("access_token"); // 키 이름 수정

    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const response = await axios.delete(
      `${BASE_API}/likes/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token"); // 키 이름 수정
        throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
      }
    }
    console.error("좋아요 취소 실패:", error);
    throw error;
  }
}

export async function getLikedProjects() {
  try {
    const token = localStorage.getItem("access_token"); // 키 이름 수정
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
    const token = localStorage.getItem("access_token"); // 키 이름 수정
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

export async function getAllProjects() {
  try {
    // 🎯 토큰 추가하여 likedByMe 정보 받기
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(`${BASE_API}/projects`, { headers });
    console.log("백엔드 응답 원본:", response.data);
    console.log("프로젝트 데이터:", response.data.data);
    console.log("첫 번째 프로젝트:", response.data.data[0]);

    // likedByMe 필드가 포함되었는지 확인
    if (response.data.data.length > 0) {
      console.log("likedByMe 필드 확인:", response.data.data[0].likedByMe);
    }

    return response.data.data;
  } catch (error) {
    console.error("프로젝트 목록 조회 실패:", error);
    throw error;
  }
}
// 프로젝트 상세 조회 API (디버깅 버전)
export async function getProjectById(id: number) {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("=== 프로젝트 상세 조회 디버깅 ===");
    console.log("토큰 존재:", !!token);
    console.log("프로젝트 ID:", id);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    console.log("요청 헤더:", headers);

    const response = await axios.get(`${BASE_API}/projects/${id}`, {
      headers,
    });

    console.log("=== 백엔드 응답 전체 ===");
    console.log("전체 응답:", response.data);
    console.log("프로젝트 데이터:", response.data.data);

    // 좋아요 관련 필드들 확인
    const projectData = response.data.data;
    console.log("=== 좋아요 관련 필드 확인 ===");
    console.log("likeCount:", projectData.likeCount);
    console.log("isLiked:", projectData.isLiked); // 이 필드가 있는지 확인
    console.log("isLikedByCurrentUser:", projectData.isLikedByCurrentUser); // 다른 이름일 수도
    console.log("liked:", projectData.liked); // 또 다른 가능한 이름
    console.log("userLiked:", projectData.userLiked); // 또 다른 가능한 이름
    console.log();
    // 모든 키 확인
    console.log("=== 프로젝트 데이터의 모든 키 ===");
    console.log("모든 키:", Object.keys(projectData));

    // 좋아요와 관련된 키만 필터링
    const likeRelatedKeys = Object.keys(projectData).filter(
      (key) =>
        key.toLowerCase().includes("like") ||
        key.toLowerCase().includes("liked")
    );
    console.log("좋아요 관련 키들:", likeRelatedKeys);

    return response.data.data;
  } catch (error) {
    console.error("프로젝트 상세 조회 실패:", error);
    throw error;
  }
}

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
