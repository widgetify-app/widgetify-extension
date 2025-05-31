import { getMainClient } from '../api'

interface EmojiResponse {
  emojis: { key: string }[]
  storageUrl: string
}

export async function getEmojiList(): Promise<string[]> {
  try {
    const api = await getMainClient()

    const emojisRes = await api.get<EmojiResponse>('/extension/emojis')

    const storageUrl = emojisRes.data.storageUrl
    const emojis = emojisRes.data.emojis

    return emojis.map((emoji) => `${storageUrl}/${emoji.key}`)
  } catch (error) {
    console.error('Error fetching emoji list:', error)
    return []
  }
}
