import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env에서 API 주소 읽기
  withCredentials: true, // 필요 시 (ex. 쿠키 기반 인증)
});

export default api;
