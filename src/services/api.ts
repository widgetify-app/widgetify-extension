import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from 'axios'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'

const rawGithubApi = axios.create({
	baseURL: 'https://raw.githubusercontent.com/sajjadmrx/btime-desktop/main',
})
let URL = ''
export async function getMainClient(): Promise<AxiosInstance> {
	let instance: AxiosInstance | undefined

	const token = await getFromStorage('auth_token')
	URL = import.meta.env.VITE_API

	if (!URL) {
		const urlResponse = await rawGithubApi.get('/.github/api.txt')
		URL = urlResponse.data
	}

	instance = axios.create({
		baseURL: URL,
		headers: {
			Authorization: token ? `Bearer ${token}` : undefined,
		},
	})

	if (!instance) {
		throw new Error('API base URL is not defined')
	}

	// Response interceptor to handle token refreshing
	instance.interceptors.response.use(
		(response: AxiosResponse) => {
			return response
		},
		async (error: AxiosError) => {
			const originalRequest = error.config as InternalAxiosRequestConfig & {
				_retry?: boolean
			}

			const ignoreEndpoints = ['/auth/login']
			if (
				ignoreEndpoints.some((endpoint) =>
					originalRequest.url?.includes(endpoint)
				)
			) {
				return Promise.reject(error)
			}

			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true
				try {
					const refresh_token: string | null =
						await getFromStorage('refresh_token')

					const response = await axios.post(`${URL}/auth/refresh`, {
						refresh_token,
					})

					const newToken = response.data.data
					if (newToken) {
						await setToStorage('auth_token', newToken)
						originalRequest.headers['Authorization'] = `Bearer ${newToken}`
					} else {
						callEvent('auth_logout', null)
					}

					return instance(originalRequest)
				} catch (_refreshError) {
					callEvent('auth_logout', null)
				}
			}

			return Promise.reject(error)
		}
	)

	return instance
}

export async function safeAwait<E, T>(promise: Promise<any>): Promise<[E, T]> {
	try {
		const result = await promise
		// @ts-ignore
		return [null, result as T]
	} catch (error) {
		// @ts-ignore
		return [error, null]
	}
}
