import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { dateKeys } from './date.keys'

interface FetchedReligiousTimeData {
	azan_sobh: string
	tolu_aftab: string
	azan_zohr: string
	ghorub_aftab: string
	azan_maghreb: string
	nimeshab: string
}

interface Prop {
	day: number
	month: number
	lat?: number
	lon?: number
}
export const useReligiousTime = (op: Prop, enabled: boolean) => {
	return useQuery({
		queryKey: dateKeys.religiousTime(op.day, op.month, op.lat, op.lon),
		queryFn: async () => {
			const client = getMainClient()
			const { data: result } = await client.get<FetchedReligiousTimeData>(
				'/date/owghat',
				{
					params: {
						day: op.day,
						month: op.month,
						lat: op.lat || undefined,
						lan: op.lon || undefined,
					},
				}
			)
			return result
		},
		enabled,
	})
}
