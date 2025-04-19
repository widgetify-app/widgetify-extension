import { getFromStorage } from '@/common/storage'
import axios, { type AxiosInstance } from 'axios'

const rawGithubApi = axios.create({
	baseURL: 'https://raw.githubusercontent.com/sajjadmrx/btime-desktop/main',
})

export async function getMainClient(): Promise<AxiosInstance> {
	const token = await getFromStorage('auth_token')
	if (import.meta.env.VITE_API) {
		return axios.create({
			baseURL: import.meta.env.VITE_API,
			headers: {
				Authorization: token ? `Bearer ${token}` : undefined,
			},
		})
	}

	const urlResponse = await rawGithubApi.get('/.github/api.txt')
	return axios.create({
		baseURL: urlResponse.data,
		headers: {
			Authorization: token ? `Bearer ${token}` : undefined,
		},
	})
}

interface EmojiResponse {
	emojis: { key: string }[]
	storageUrl: string
}

export async function getEmojiList(): Promise<string[]> {
	try {
		// Get the storage URL first
		const api = await getMainClient()

		// Then get the list of emojis
		const emojisRes = await api.get<EmojiResponse>('/extension/emojis')

		const storageUrl = emojisRes.data.storageUrl
		const emojis = emojisRes.data.emojis

		// Return the full URL for each emoji
		return emojis.map((emoji) => `${storageUrl}/${emoji.key}`)
	} catch (error) {
		console.error('Error fetching emoji list:', error)
		return []
	}
}
