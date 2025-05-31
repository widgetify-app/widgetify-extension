import { getFromStorage } from '@/common/storage'
import axios, { type AxiosInstance } from 'axios'

const rawGithubApi = axios.create({
  baseURL: 'https://raw.githubusercontent.com/sajjadmrx/btime-desktop/main',
})
let URL = ''
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

  if (!URL) {
    const urlResponse = await rawGithubApi.get('/.github/api.txt')
    URL = urlResponse.data
  }
  return axios.create({
    baseURL: URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  })
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
