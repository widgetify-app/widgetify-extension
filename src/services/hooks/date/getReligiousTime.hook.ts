import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export interface FetchedReligiousTimeData {
	azan_sobh: string
	tolu_aftab: string
	azan_zohr: string
	ghorub_aftab: string
	azan_maghreb: string
	nimeshab: string
}
export interface FetchedReligiousTimeData {
	azan_sobh: string
	tolu_aftab: string
	azan_zohr: string
	ghorub_aftab: string
	azan_maghreb: string
	nimeshab: string
}

export const useReligiousTime = (day: number, month: number, enabled: boolean) => {
	return useQuery({
		queryKey: ['religiousTime', day, month],
		queryFn: async () => {
			const client = await getMainClient()
			const { data: result } = await client.get<FetchedReligiousTimeData>(
				'/date/owghat',
				{
					params: {
						day,
						month,
					},
				}
			)
			return result
		},
		enabled,
	})
}
