import { translateError } from '@/utils/translate-error'
import {
  type UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getMainClient } from '../../api'

interface FriendRequestParams {
  username: string
}

interface FriendRequestResponse {
  data: null
  message: string
}

export interface FriendRequestError {
  success: false
  message:
    | 'CANT_REQUEST_YOURSELF'
    | 'USER_NOT_FOUND'
    | 'FRIEND_REQUEST_ALREADY_SENT'
    | 'FRIEND_REQUEST_ALREADY_EXISTS'
}

export interface FriendUser {
  name: string
  avatar: string
  username: string
  userId: string
  extras?: {
    activity?: string
    selectedWallpaper?: string
  }
}

export interface Friend {
  id: string
  user: FriendUser
  sendByMe: boolean
  status: 'PENDING' | 'ACCEPTED'
}

export interface FriendsResponse {
  data: {
    friends: Friend[]
    totalPages: number
  }
}

export interface GetFriendsParams {
  status: 'PENDING' | 'ACCEPTED'
  page?: number
  limit?: number
  enabled?: boolean
}

export interface FriendActionParams {
  friendId: string
  state: 'accepted' | 'rejected'
}

interface FriendActionResponse {
  message: string
}

async function sendFriendRequest(
  params: FriendRequestParams,
): Promise<FriendRequestResponse> {
  const client = await getMainClient()
  const response = await client.post<FriendRequestResponse>(
    '/friends/requests',
    params,
  )
  return response.data
}

async function getFriends(params: GetFriendsParams): Promise<FriendsResponse> {
  const { status, page, limit } = params
  const client = await getMainClient()

  const queryParams = new URLSearchParams()
  queryParams.append('status', status)
  if (page !== undefined) queryParams.append('page', page.toString())
  if (limit !== undefined) queryParams.append('limit', limit.toString())

  const response = await client.get<FriendsResponse>(
    `/friends?${queryParams.toString()}`,
  )
  return response.data
}

async function handleFriendRequest(
  params: FriendActionParams,
): Promise<FriendActionResponse> {
  const client = await getMainClient()
  const response = await client.put<FriendActionResponse>(
    `/friends/requests/${params.friendId}`,
    {
      state: params.state,
    },
  )
  return response.data
}

async function removeFriend(friendId: string): Promise<FriendActionResponse> {
  const client = await getMainClient()
  const response = await client.delete<FriendActionResponse>(
    `/friends/${friendId}`,
  )
  return response.data
}

export function useSendFriendRequest() {
  return useMutation({
    mutationFn: (params: FriendRequestParams) => sendFriendRequest(params),
    onError: (error) => {
      return translateError(error)
    },
  })
}

export function useGetFriends(params: GetFriendsParams) {
  return useQuery({
    queryKey: ['friends', params.status, params.page, params.limit],
    queryFn: () => getFriends(params),
    retry: 1,
    enabled: params.enabled !== undefined ? params.enabled : true,
  })
}

export function useHandleFriendRequest(
  options?: Partial<
    UseMutationOptions<FriendActionResponse, unknown, FriendActionParams>
  >,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: handleFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
    onError: (error) => {
      console.error('Error handling friend request:', error)
      return translateError(error)
    },
    ...options,
  })
}

export function useRemoveFriend(
  options?: Partial<UseMutationOptions<FriendActionResponse, unknown, string>>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
    onError: (error) => {
      console.error('Error removing friend:', error)
      return translateError(error)
    },
    ...options,
  })
}
