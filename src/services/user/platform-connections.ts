import { getMainClient } from '@/services/api'

export async function connectPlatform(platformId: string): Promise<{ url: string }> {
	const response = await getMainClient().post(`/${platformId}/connect`)
	return response.data
}

export async function disconnectPlatform(platformId: string): Promise<void> {
	await getMainClient().post(`/${platformId}/disconnect`)
}
