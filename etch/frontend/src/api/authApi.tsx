import axios from "axios";

export const API_SERVER_HOST = "https://etch.it.kr";

const apiClient = axios.create({
  baseURL: `${API_SERVER_HOST}/api/v1`,
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getMemberInfo = async () => {
  try {
    const response = await apiClient.get("/members/me");
    console.log("Member info:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
