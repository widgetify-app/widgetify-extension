import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export interface FetchedYouTubeProfile {
  id: string
  name: string
  profile: string
  subscribers: string
  totalViews: string
  totalVideos: string
  createdAt: string
}

async function fetchYouTubeProfile(
  username: string,
): Promise<FetchedYouTubeProfile> {
  const client = await getMainClient()
  const { data } = await client.get<FetchedYouTubeProfile>(
    `/google/youtube/profile/${username}`,
  )
  return data
}

export function useGetYouTubeProfile(
  username: string,
  options: {
    enabled?: boolean
    refetchInterval?: number | null
  } = {},
) {
  return useQuery<FetchedYouTubeProfile>({
    queryKey: ['getYouTubeProfile', username],
    queryFn: () => fetchYouTubeProfile(username),
    enabled: options.enabled && username.length > 0,
    refetchInterval: options.refetchInterval || 0,
    retry: 0,
  })
}
