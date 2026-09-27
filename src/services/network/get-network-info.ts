import type { AxiosError } from 'axios'
import { getMainClient, safeAwait } from '@/services/api'

interface IpInfo {
	ip: string | null
	country: string | null
	countryIcon: string | null
	city: string | null
	isp: string | null
}

export async function getIpInfo(): Promise<IpInfo | null> {
	const [error, response] = await safeAwait<AxiosError, { data: IpInfo }>(
		getMainClient().get('/extension/@me/ip')
	)
	if (error || !response) return null

	const data = response.data
	return {
		ip: data.ip,
		country: data.country,
		countryIcon: data.countryIcon,
		city: data.city,
		isp: data.isp,
	}
}

export async function measurePing(): Promise<number | null> {
	const start = Date.now()
	const [error] = await safeAwait<AxiosError, unknown>(getMainClient().get('/'))
	if (error && !error.status) return null

	return Date.now() - start
}
