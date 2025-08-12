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
export async function deleteProject(projectId: number) {
  try {
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
        localStorage.removeItem("access_token");
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
    const token = localStorage.getItem("access_token");

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
        localStorage.removeItem("access_token");
        throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
      }
    }
    console.error("좋아요 추가 실패:", error);
    throw error;
  }
}

export async function unlikeProject(projectId: number) {
  try {
    const token = localStorage.getItem("access_token");

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
        localStorage.removeItem("access_token");
        throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
      }
    }
    console.error("좋아요 취소 실패:", error);
    throw error;
  }
}

// 🔥 페이지네이션 적용: 좋아요한 프로젝트 조회
export async function getLikedProjects() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_API}/likes/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("좋아요한 프로젝트 응답:", response.data);

    // 페이지네이션 응답에서 content 배열 추출
    const data = response.data.data;
    if (Array.isArray(data)) {
      return data; // 기존 배열 방식이면 그대로
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || []; // 페이지네이션이면 content 추출
    }

    return [];
  } catch (error) {
    console.error("좋아요한 프로젝트 조회 실패:", error);
    throw error;
  }
}

// 🔥 페이지네이션 적용: 내 프로젝트 조회
export async function getMyProjects() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_API}/projects/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("내 프로젝트 응답:", response.data);

    // 페이지네이션 응답에서 content 배열 추출
    const data = response.data.data;
    if (Array.isArray(data)) {
      return data; // 기존 배열 방식이면 그대로
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || []; // 페이지네이션이면 content 추출
    }

    return [];
  } catch (error) {
    console.error("내 프로젝트 조회 실패:", error);
    throw error;
  }
}

// 🔥 페이지네이션 적용: 프로젝트 목록 조회 API
export async function getAllProjects() {
  try {
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(`${BASE_API}/projects`, { headers });
    console.log("백엔드 응답 원본:", response.data);
    console.log("프로젝트 데이터:", response.data.data);

    // 🔥 페이지네이션 응답에서 content 배열 추출
    const pageData = response.data.data;
    const projects = pageData.content || [];

    console.log("첫 번째 프로젝트:", projects[0]);

    if (projects.length > 0) {
      console.log("likedByMe 필드 확인:", projects[0].likedByMe);
    }

    return projects; // ✅ 배열 반환
  } catch (error) {
    console.error("프로젝트 목록 조회 실패:", error);
    throw error;
  }
}

// 프로젝트 상세 조회 API (단일 객체이므로 페이지네이션 적용 안됨)
export async function getProjectById(id: number) {
  try {
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(`${BASE_API}/projects/${id}`, { headers });
    return response.data.data;
  } catch (error) {
    console.error("프로젝트 상세 조회 실패:", error);
    throw error;
  }
}

// 🔥 페이지네이션 적용: 특정 사용자의 공개 프로젝트 조회
export async function getUserPublicProjects(userId: number) {
  try {
    const response = await axios.get(
      `${BASE_API}/projects/user/${userId}/public`
    );
    console.log("사용자 공개 프로젝트 응답:", response.data);

    // 페이지네이션 응답에서 content 배열 추출
    const data = response.data.data;
    if (Array.isArray(data)) {
      return data; // 기존 배열 방식이면 그대로
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || []; // 페이지네이션이면 content 추출
    }

    return [];
  } catch (error) {
    console.error("사용자 공개 프로젝트 조회 실패:", error);
    throw error;
  }
}

// 🔥 페이지네이션 적용: 쿼리 파라미터 방식 사용자 프로젝트 조회
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
    console.log("사용자 프로젝트 응답:", response.data);

    // 페이지네이션 응답에서 content 배열 추출
    const data = response.data.data;
    if (Array.isArray(data)) {
      return data; // 기존 배열 방식이면 그대로
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || []; // 페이지네이션이면 content 추출
    }

    return [];
  } catch (error) {
    console.error("사용자 프로젝트 조회 실패:", error);
    throw error;
  }
}
