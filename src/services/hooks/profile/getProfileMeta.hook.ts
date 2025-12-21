import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface ProfileMetaItem {
	id: string
	type: 'OCCUPATION' | 'INTEREST'
	title: string
	slug: string
	isActive: boolean
	order: number
	createdAt: string
}

async function fetchProfileMeta(
	type: 'OCCUPATION' | 'INTEREST'
): Promise<ProfileMetaItem[]> {
	const client = await getMainClient()
	const response = await client.get<ProfileMetaItem[]>(`/profile-meta?type=${type}`)
	return response.data
}

export function useGetOccupations(enabled: boolean = true) {
	return useQuery<ProfileMetaItem[]>({
		queryKey: ['profile-meta-occupations'],
		queryFn: () => fetchProfileMeta('OCCUPATION'),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
}

export function useGetInterests(enabled: boolean = true) {
	return useQuery<ProfileMetaItem[]>({
		queryKey: ['profile-meta-interests'],
		queryFn: () => fetchProfileMeta('INTEREST'),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
}
