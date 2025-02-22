import axios, { type AxiosInstance } from 'axios'

const rawGithubApi = axios.create({
	baseURL: 'https://raw.githubusercontent.com/sajjadmrx/btime-desktop/main',
})

export interface ApiResponse<T> {
	success: boolean
	statusCode: number
	data: T
}

export async function getMainClient(): Promise<AxiosInstance> {
	if (import.meta.env.VITE_API) {
		// return import.meta.env.VITE_API
		return axios.create({ baseURL: import.meta.env.VITE_API })
	}

	const urlResponse = await rawGithubApi.get('/.github/api.txt')
	return axios.create({ baseURL: urlResponse.data })
}
