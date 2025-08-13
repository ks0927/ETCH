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

// 내 프로젝트 API 응답 타입 (스웨거 기준)
export interface MyProjectResponse {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  viewCount: number;
  likeCount: number;
  nickname: string;
  isPublic: boolean;
  popularityScore: number;
}

// 토큰을 안전하게 가져오는 유틸리티 함수
function getAuthToken(): string | null {
  // 먼저 정상적인 키로 시도
  let token = localStorage.getItem("access_token");

  // 찾지 못했다면 localStorage를 순회해서 access_token이 포함된 키 찾기
  if (!token) {
    console.log(
      "정상 키로 토큰을 찾을 수 없습니다. localStorage 전체 검색 중..."
    );

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`키 확인: "${key}"`);

      if (
        key &&
        (key.includes("access_token") || key.trim() === "access_token")
      ) {
        token = localStorage.getItem(key);
        console.log(
          `토큰 발견! 키: "${key}", 토큰: ${token?.substring(0, 50)}...`
        );

        if (token) {
          // 정상적인 키로 다시 저장하고 잘못된 키는 제거
          localStorage.setItem("access_token", token);
          if (key !== "access_token") {
            localStorage.removeItem(key);
            console.log(
              `잘못된 키 "${key}" 제거하고 "access_token"으로 저장했습니다.`
            );
          }
          break;
        }
      }
    }
  }

  if (token) {
    console.log(`최종 토큰: ${token.substring(0, 50)}...`);
  } else {
    console.log("토큰을 찾을 수 없습니다.");
  }

  return token;
}

// 프로젝트 생성 API - ProjectInputData 사용
export async function createProject(projectInput: ProjectInputData) {
  try {
    const token = getAuthToken();

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

    // 토큰이 있으면 헤더에 포함
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    try {
      const response = await axios.post(
        `${BASE_API}/projects`,
        formData,
        config
      );
      return response.data.data;
    } catch (authError) {
      // 401 오류인 경우 인증 없이 재시도 (개발용)
      if (axios.isAxiosError(authError) && authError.response?.status === 401) {
        console.warn("⚠️ 인증 실패. 개발 환경에서 인증 없이 재시도합니다.");
        console.log("실제 환경에서는 로그인이 필요합니다.");

        // 토큰 없이 재시도
        const retryResponse = await axios.post(
          `${BASE_API}/projects`,
          formData
        );
        return retryResponse.data.data;
      }
      throw authError;
    }
  } catch (error) {
    console.error("프로젝트 생성 실패:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);

      if (error.response?.status === 401) {
        throw new Error("로그인이 필요합니다. 로그인 페이지로 이동해주세요.");
      }
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
    const token = getAuthToken();
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
    const token = getAuthToken();
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
    const token = getAuthToken();
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
    const token = getAuthToken();
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
    const token = getAuthToken();
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

// 내 프로젝트 조회 API - 올바른 엔드포인트 사용
export async function getMyProjects(): Promise<MyProjectResponse[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    console.log("📡 내 프로젝트 API 호출:", `${BASE_API}/members/projects`);

    const response = await axios.get(`${BASE_API}/members/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ 내 프로젝트 API 응답:", response.data);

    // 스웨거 응답 구조에 맞게 데이터 추출
    const data = response.data.data;

    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || [];
    }

    return [];
  } catch (error) {
    console.error("내 프로젝트 조회 실패:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
      } else if (error.response?.status === 403) {
        throw new Error("권한이 없습니다.");
      }
    }

    throw error;
  }
}

// 최신순으로 기본 정렬하는 프로젝트 목록 조회
export async function getAllProjects(sort: string = "latest") {
  try {
    const token = getAuthToken();

    const config = token
      ? {
          headers: { Authorization: `Bearer ${token}` },
        }
      : {};

    // 정렬 파라미터 추가
    const response = await axios.get(
      `${BASE_API}/projects?sort=${sort}&pageSize=50`, // pageSize=50 추가
      config
    );

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
        const response = await axios.get(`${BASE_API}/projects?sort=${sort}`);
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
    const token = getAuthToken();

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
