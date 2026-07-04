import axios from 'axios'
import { ApiError } from '@/utils/apiError'

const baseURL =
  import.meta.env.VITE_API_BASE_URL ??
  'https://website-audit-consultant-llatform-server.onrender.com/api'

export const axiosClient = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const bodyMessage =
      typeof error.response?.data?.message === 'string' ? error.response.data.message : null

    if (status === 502) {
      return Promise.reject(
        new ApiError(
          bodyMessage ?? 'The audit server returned an error (502). The backend may be down or restarting.',
          status,
        ),
      )
    }

    if (status === 429) {
      return Promise.reject(
        new ApiError(
          bodyMessage ?? 'Too many requests. Please wait a minute and try again.',
          status,
        ),
      )
    }

    const message = bodyMessage ?? error.message ?? 'An unexpected error occurred'
    return Promise.reject(new ApiError(message, status))
  },
)
