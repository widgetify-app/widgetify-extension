import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from 'axios'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'

export const API_URL = import.meta.env.VITE_API

const VERSION = browser.runtime.getManifest().version

const IGNORE_ENDPOINTS = [
	'/auth/signin',
	'/auth/signup',
	'/auth/otp',
	'/auth/otp/verify',
	'/auth/oauth/google',
]

let instance: AxiosInstance | null = null
let refreshPromise: Promise<string | null> | null = null

export async function getMainClient(): Promise<AxiosInstance> {
	if (instance) {
		return instance
	}

	if (!API_URL) {
		throw new Error('API base URL is not defined')
	}

	instance = axios.create({
		baseURL: API_URL,
		headers: {
			client: 'widgetify-extension',
			version: VERSION,
		},
	})

	instance.interceptors.request.use(async (config) => {
		const token = await getFromStorage('auth_token')

		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		} else {
			delete config.headers.Authorization
		}

		return config
	})

	instance.interceptors.response.use(
		(response: AxiosResponse) => response,
		async (error: AxiosError) => {
			const originalRequest = error.config as InternalAxiosRequestConfig & {
				_retry?: boolean
			}

			if (
				IGNORE_ENDPOINTS.some((endpoint) =>
					originalRequest.url?.includes(endpoint)
				)
			) {
				return Promise.reject(error)
			}

			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true

				try {
					if (!refreshPromise) {
						refreshPromise = (async () => {
							const refreshToken = await getFromStorage('refresh_token')

							if (!refreshToken) {
								return null
							}

							const response = await axios.post(`${API_URL}/auth/refresh`, {
								refresh_token: refreshToken,
							})

							const newToken = response.data.data

							if (!newToken) {
								return null
							}

							await setToStorage('auth_token', newToken)

							return newToken
						})()

						refreshPromise.finally(() => {
							refreshPromise = null
						})
					}

					const newToken = await refreshPromise

					if (!newToken) {
						callEvent('auth_logout', null)
						return Promise.reject(error)
					}

					originalRequest.headers.Authorization = `Bearer ${newToken}`

					return instance!(originalRequest)
				} catch (_refreshError) {
					callEvent('auth_logout', null)
					return Promise.reject(error)
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
		// @ts-expect-error
		return [null, result as T]
	} catch (error) {
		// @ts-expect-error
		return [error, null]
	}
}
