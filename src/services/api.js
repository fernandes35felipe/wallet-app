import axios from "axios"
import { getToken } from "./auth"

const api = axios.create({
  baseURL: "http://localhost:3000",
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config = `Bearer ${token}`
  }
  return config
})

export default api
