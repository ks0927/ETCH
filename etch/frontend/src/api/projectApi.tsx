import axios from "axios";
import { BASE_API } from "./BASE_API";
import type { ProjectCategoryEnum } from "../types/project/projectCategroyData";
import type { ProjectInputData } from "../types/project/projectDatas";

// 백엔드 요청 타입 (기존 유지)
export interface ProjectCreateRequestData {
  title: string;
  content: string;
  projectCategory: ProjectCategoryEnum;
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
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (
        key &&
        (key.includes("access_token") || key.trim() === "access_token")
      ) {
        token = localStorage.getItem(key);

        if (token) {
          // 정상적인 키로 다시 저장하고 잘못된 키는 제거
          localStorage.setItem("access_token", token);
          if (key !== "access_token") {
            localStorage.removeItem(key);
          }
          break;
        }
      }
    }
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
      projectCategory: projectInput.projectCategory,
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
      projectCategory: projectInput.projectCategory,
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

    const response = await axios.get(`${BASE_API}/members/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

export async function getAllProjects() {
  try {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    // 정렬 파라미터 없이 모든 데이터를 가져옴
    const response = await axios.get(
      `${BASE_API}/projects?pageSize=100`,
      config
    );

    const pageData = response.data.data;
    const projects = pageData.content || [];
    return projects;
  } catch (error) {
    console.error("프로젝트 목록 조회 실패:", error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("access_token");
      try {
        const response = await axios.get(`${BASE_API}/projects?pageSize=100`);
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

// ✅ 새로운 함수: 정렬없이 모든 프로젝트 가져오기 (기존 동작 유지용)
export async function getAllProjectsUnsorted() {
  try {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const response = await axios.get(
      `${BASE_API}/projects?pageSize=100`, // 정렬 파라미터 없음
      config
    );

    const pageData = response.data.data;
    const projects = pageData.content || [];
    return projects;
  } catch (error) {
    console.error("프로젝트 목록 조회 실패:", error);

    // 401 오류 시 토큰 제거하고 재시도
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("access_token");

      try {
        const response = await axios.get(`${BASE_API}/projects?pageSize=100`);
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

// 만약 서버에서 페이징이 필요하다면 별도 함수로 분리
export async function getAllProjectsWithPaging(
  page: number = 0,
  size: number = 20,
  sort: string = "latest"
) {
  try {
    const token = getAuthToken();

    const config = token
      ? {
          headers: { Authorization: `Bearer ${token}` },
        }
      : {};

    const response = await axios.get(
      `${BASE_API}/projects?page=${page}&size=${size}&sort=${sort}`,
      config
    );

    return response.data.data;
  } catch (error) {
    console.error("페이징된 프로젝트 목록 조회 실패:", error);
    throw error;
  }
}
// 🔧 projectApi.js 파일에서 getProjectById 함수를 이렇게 수정하세요

export async function getProjectById(id: number) {
  try {
    const token = getAuthToken();

    const config = token
      ? {
          headers: { Authorization: `Bearer ${token}` },
        }
      : {};

    const response = await axios.get(`${BASE_API}/projects/${id}`, config);

    const projectData = response.data.data;

    return projectData;
  } catch (error) {
    console.error("프로젝트 상세 조회 실패:", error);

    // 401 오류 시 토큰 제거하고 재시도
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("access_token");

      try {
        const response = await axios.get(`${BASE_API}/projects/${id}`);

        // 재시도에서도 같은 로깅

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
    // 토큰 가져오기
    const token = getAuthToken();

    if (!token) {
      console.error("인증 토큰이 없습니다. 로그인이 필요합니다.");
      throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
    }

    // 헤더에 토큰 포함하여 요청
    const response = await axios.get(`${BASE_API}/members/${userId}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 전체 응답 구조 확인

    const data = response.data.data;

    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || [];
    }

    return [];
  } catch (error) {
    console.error("=== 오류 상세 정보 ===");

    if (axios.isAxiosError(error)) {
      console.error("Axios Error Details:");
      console.error("- Status:", error.response?.status);
      console.error("- Status Text:", error.response?.statusText);
      console.error(
        "- Response Data:",
        JSON.stringify(error.response?.data, null, 2)
      );
      console.error("- Request URL:", error.config?.url);
      console.error("- Request Method:", error.config?.method);

      // 401 에러인 경우 특별 처리
      if (error.response?.status === 401) {
        console.error("인증 실패: 토큰이 만료되었거나 유효하지 않습니다.");
        // 필요시 로그인 페이지로 리다이렉트하거나 토큰 갱신 로직 추가
      }
    } else {
      console.error("General Error:", error);
    }

    throw error;
  }
}

export async function getUserProjects(
  userId: number,
  isPublicOnly: boolean = false
) {
  try {
    // 토큰 가져오기
    const token = getAuthToken();

    const params = new URLSearchParams();
    params.append("userId", userId.toString());
    if (isPublicOnly) {
      params.append("isPublic", "true");
    }

    // 헤더 설정 - 토큰이 있으면 포함
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      : {
          headers: {
            "Content-Type": "application/json",
          },
        };

    const response = await axios.get(
      `${BASE_API}/projects?${params.toString()}`,
      config
    );

    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || [];
    }

    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // 401 에러인 경우 토큰 없이 재시도 (공개 프로젝트만)
        try {
          const params = new URLSearchParams();
          params.append("userId", userId.toString());
          params.append("isPublic", "true"); // 공개 프로젝트만 요청

          const retryResponse = await axios.get(
            `${BASE_API}/projects?${params.toString()}`
          );

          const retryData = retryResponse.data.data;
          if (Array.isArray(retryData)) {
            return retryData;
          } else if (
            retryData &&
            typeof retryData === "object" &&
            "content" in retryData
          ) {
            return retryData.content || [];
          }

          return [];
        } catch (retryError) {
          console.error("공개 프로젝트 조회도 실패:", retryError);
          throw retryError;
        }
      } else if (error.response?.status === 403) {
        // 권한 없음 - 빈 배열 반환
        return [];
      }
    }

    console.error("사용자 프로젝트 조회 실패:", error);
    throw error;
  }
}
