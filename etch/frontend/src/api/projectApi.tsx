import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080";

const prefix = `${API_SERVER_HOST}/api/projects`;

export const getOne = async (pno: number) => {
  const res = await axios.get(`${prefix}/${pno}`);
  return res.data;
};
