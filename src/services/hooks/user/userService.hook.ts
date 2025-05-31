import {
  getFromStorage,
  removeFromStorage,
  setToStorage,
} from '@/common/storage'
import type { Wallpaper } from '@/common/wallpaper.interface'

import { getMainClient } from '@/services/api'
import {
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

interface FetchedProfile {
  email: string
  avatar: string
  username?: string
  name: string
  connections: string[]
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null
  friendshipStats: {
    accepted: number
    pending: number
  }
  wallpaper: Wallpaper | null
  activity?: string
}

export interface UserProfile extends FetchedProfile {
  inCache?: boolean
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const client = await getMainClient()
  try {
    const response = await client.get<UserProfile>('/extension/@me')
    await setToStorage('profile', { ...response.data, inCache: true })
    return response.data
  } catch (error: any) {
    // if server error or network error, return cache data
    const isServerErrorOrNetworkError =
      error.response?.status >= 500 || error.code === 'ERR_NETWORK'
    if (isServerErrorOrNetworkError) {
      const cachedProfile = await getFromStorage('profile')
      if (cachedProfile) {
        return cachedProfile
      }
    }

    if (error.response?.status === 401) {
      await removeFromStorage('auth_token')
      await removeFromStorage('profile')
    }

    throw error
  }
}

export function useGetUserProfile(
  options?: Partial<UseQueryOptions<UserProfile>>,
) {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  })
}

interface UpdateActivityParams {
  activity: string | undefined
}

interface UpdateActivityResponse {
  message: string
}

async function updateActivity(
  body: UpdateActivityParams,
): Promise<UpdateActivityResponse> {
  const client = await getMainClient()
  const response = await client.put<UpdateActivityResponse>(
    '/extension/@me/activity',
    body,
  )
  return response.data
}

export function useUpdateActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
    onError: (error) => {
      console.error('Error updating activity:', error)
    },
  })
}

export async function setUserWallpaperApi(wallpaperId: string) {
  const client = await getMainClient()

  await client.put('/extension/@me/wallpaper', {
    wallpaperId,
  })
}
