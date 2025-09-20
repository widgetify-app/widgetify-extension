import { getMainClient } from '@/services/api'
import { logError, getUserFriendlyMessage } from '@/utils/error-handler'
import { useCallback, useEffect, useState } from 'react'

const cachedTimezones: Map<string, FetchedTimezone[]> = new Map()

export const useTimezones = () => {
	const [data, setData] = useState<FetchedTimezone[] | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchTimezones = useCallback(async () => {
		try {
			const cacheKey = 'all-timezones'
			if (cachedTimezones.has(cacheKey)) {
				setData(cachedTimezones.get(cacheKey) as FetchedTimezone[])
				setLoading(false)
				return
			}

			setLoading(true)
			setError(null)
			const timezones = await getTimezones()
			setData(timezones)

			cachedTimezones.set(cacheKey, timezones)
		} catch (err) {
			logError(err, 'useTimezones')
			const userFriendlyMessage = getUserFriendlyMessage(err)
			setError(new Error(userFriendlyMessage))
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchTimezones()
	}, [fetchTimezones])

	return { data, loading, error, refetch: fetchTimezones }
}

export interface FetchedTimezone {
	label: string
	value: string
	offset: string
}

export async function getTimezones(): Promise<FetchedTimezone[]> {
	try {
		const api = await getMainClient()
		const response = await api.get<FetchedTimezone[]>('/date/timezones')
		return response.data
	} catch (error) {
		logError(error, 'getTimezones')
		return []
	}
}
