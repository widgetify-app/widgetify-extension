import { getMainClient } from '../api'

export async function GetRss(url: string) {
	const api = await getMainClient()
	const result = await api.get('/rss', {
		params: {
			url: url,
		},
	})
	return result.data
}
