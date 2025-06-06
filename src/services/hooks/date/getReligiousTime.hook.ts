import { getMainClient } from '@/services/api'
import { useEffect, useState } from 'react'

export interface FetchedReligiousTimeData {
	azan_sobh: string
	tolu_aftab: string
	azan_zohr: string
	ghorub_aftab: string
	azan_maghreb: string
	nimeshab: string
}
const cachedData: Map<string, FetchedReligiousTimeData> = new Map()
export const useReligiousTime = (
	day: number,
	month: number,
	lat: number,
	long: number
) => {
	const [data, setData] = useState<FetchedReligiousTimeData | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		const fetchReligiousTime = async () => {
			try {
				const cacheKey = `${day}-${month}-${lat}-${long}`
				if (cachedData.has(cacheKey)) {
					setData(cachedData.get(cacheKey) as FetchedReligiousTimeData)
					return
				}

				setLoading(true)
				const client = await getMainClient()

				const { data: result } = await client.get<FetchedReligiousTimeData>(
					'/date/owghat',
					{
						params: {
							day,
							month,
							lat,
							long,
						},
					}
				)

				setData(result)

				cachedData.set(cacheKey, result)
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error('An unknown error occurred')
				)
			} finally {
				setLoading(false)
			}
		}

		fetchReligiousTime()
	}, [day, month, lat, long])

	return { data, loading, error }
}
