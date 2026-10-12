import { computeClockOffset } from '@/common/utils/trusted-time'
import { FRESH_REQUEST, getMainClient } from '@/services/api'

interface ServerTimeResponse {
	now: number
}

export async function getServerClockOffset(): Promise<number> {
	const client = getMainClient()
	const startedAt = performance.now()
	const { data } = await client.get<ServerTimeResponse>('/date/now', FRESH_REQUEST)
	const roundTripMs = performance.now() - startedAt

	return computeClockOffset({
		serverMs: data.now,
		roundTripMs,
		systemMs: Date.now(),
	})
}
