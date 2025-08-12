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
    // 토큰 디버깅
    const token = localStorage.getItem("access_token");
    console.log("=== 토큰 디버깅 ===");
    console.log("localStorage의 모든 키:", Object.keys(localStorage));
    console.log("access_token 값:", token);
    console.log("토큰 타입:", typeof token);
    console.log("토큰 길이:", token?.length);

    // 다른 가능한 토큰 키들도 확인
    console.log("accessToken:", localStorage.getItem("accessToken"));
    console.log("token:", localStorage.getItem("token"));
    console.log("authToken:", localStorage.getItem("authToken"));

    if (!token) {
      console.error("토큰이 없습니다. localStorage 전체 내용:", localStorage);
      throw new Error("로그인이 필요합니다.");
    }

    const formData = new FormData();

    // 1. 프로젝트 데이터
    const requestData: ProjectCreateRequestData = {
      title: projectInput.title,
      content: projectInput.content,
      category: projectInput.projectCategory,
      techCodeIds: projectInput.techCodeIds,
      githubUrl: projectInput.githubUrl,
      youtubeUrl: projectInput.youtubeUrl,
      isPublic: projectInput.isPublic,
    };

    // Blob을 사용하여 JSON을 올바른 Content-Type으로 전송
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

    console.log("=== 요청 헤더 확인 ===");
    console.log("Authorization 헤더:", `Bearer ${token}`);

    const response = await axios.post(`${BASE_API}/projects`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("프로젝트 생성 실패:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
    }
    throw error;
  }
}

// 프로젝트 수정 API
export async function updateProject(
  projectId: number,
  projectInput: ProjectInputData
) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const formData = new FormData();

    const requestData = {
      title: projectInput.title,
      content: projectInput.content,
      category: projectInput.projectCategory,
      techCodeIds: projectInput.techCodeIds,
      githubUrl: projectInput.githubUrl || null,
      youtubeUrl: projectInput.youtubeUrl || null,
      isPublic: projectInput.isPublic,
      removeThumbnail: projectInput.removeThumbnail,
      removeFileIds: projectInput.removeFileIds,
      removePdf: projectInput.removePdf,
    };

    const dataBlob = new Blob([JSON.stringify(requestData)], {
      type: "application/json",
    });
    formData.append("data", dataBlob);

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
          Authorization: `Bearer ${token}`,
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

export async function getLikedProjects() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_API}/likes/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || [];
    }

    return [];
  } catch (error) {
    console.error("좋아요한 프로젝트 조회 실패:", error);
    throw error;
  }
}

export async function getMyProjects() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_API}/projects/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || [];
    }

    return [];
  } catch (error) {
    console.error("내 프로젝트 조회 실패:", error);
    throw error;
  }
}

export async function getAllProjects() {
  try {
    const token = localStorage.getItem("access_token");

    // 토큰이 있으면 헤더에 포함, 없으면 헤더 없이 요청
    const config = token
      ? {
          headers: { Authorization: `Bearer ${token}` },
        }
      : {};

    const response = await axios.get(`${BASE_API}/projects`, config);

    console.log("getAllProjects 응답:", response.data);

    const pageData = response.data.data;
    const projects = pageData.content || [];

    return projects;
  } catch (error) {
    console.error("프로젝트 목록 조회 실패:", error);

    // 401 오류 시 토큰 제거하고 재시도
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log("토큰이 만료되었습니다. 토큰 제거 후 재시도...");
      localStorage.removeItem("access_token");

      // 토큰 없이 재시도
      try {
        const response = await axios.get(`${BASE_API}/projects`);
        const pageData = response.data.data;
        const projects = pageData.content || [];
        return projects;
      } catch (retryError) {
        console.error("재시도 실패:", retryError);
        throw retryError;
      }
    }

    throw error;
  }
}

export async function getProjectById(id: number) {
  try {
    const token = localStorage.getItem("access_token");

    const config = token
      ? {
          headers: { Authorization: `Bearer ${token}` },
        }
      : {};

    const response = await axios.get(`${BASE_API}/projects/${id}`, config);
    return response.data.data;
  } catch (error) {
    console.error("프로젝트 상세 조회 실패:", error);

    // 401 오류 시 토큰 제거하고 재시도
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log("토큰이 만료되었습니다. 토큰 제거 후 재시도...");
      localStorage.removeItem("access_token");

      try {
        const response = await axios.get(`${BASE_API}/projects/${id}`);
        return response.data.data;
      } catch (retryError) {
        console.error("재시도 실패:", retryError);
        throw retryError;
      }
    }

    throw error;
  }
}

export async function getUserPublicProjects(userId: number) {
  try {
    const response = await axios.get(
      `${BASE_API}/projects/user/${userId}/public`
    );

    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || [];
    }

    return [];
  } catch (error) {
    console.error("사용자 공개 프로젝트 조회 실패:", error);
    throw error;
  }
}

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

    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || [];
    }

    return [];
  } catch (error) {
    console.error("사용자 프로젝트 조회 실패:", error);
    throw error;
  }
}
