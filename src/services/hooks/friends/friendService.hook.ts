import {
	type UseMutationOptions,
	useInfiniteQuery,
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
		activity?: string // a short text (like discord, instagram), example: "Hello World" | "good day!"..
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

export interface UserActivity {
	name: string
	username: string
	avatar: string
	activityId: string | null
	content: string
	isSelf: boolean
}
export interface ActivitiesResponse {
	activities: UserActivity[]
	currentUser: UserActivity | null
}

export interface GetFriendsParams {
	status: 'PENDING' | 'ACCEPTED'
	page?: number
	limit?: number
	enabled?: boolean
	caching: boolean
}

export interface FriendActionParams {
	friendId: string
	state: 'accepted' | 'rejected'
}

interface FriendActionResponse {
	message: string
}

async function sendFriendRequest(
	params: FriendRequestParams
): Promise<FriendRequestResponse> {
	const client = await getMainClient()
	const response = await client.post<FriendRequestResponse>('/friends/requests', params)
	return response.data
}

async function getFriends(params: GetFriendsParams): Promise<FriendsResponse> {
	const { status, page, limit } = params
	const client = await getMainClient()

	const queryParams = new URLSearchParams()
	queryParams.append('status', status)
	if (page !== undefined) queryParams.append('page', page.toString())
	if (limit !== undefined) queryParams.append('limit', limit.toString())

	const response = await client.get<FriendsResponse>(`/friends`, {
		params: queryParams,
	})
	return response.data
}

async function getActivities(): Promise<ActivitiesResponse> {
	const client = await getMainClient()
	const response = await client.get<{ data: ActivitiesResponse }>(
		`/friends/activities/beta`
	)
	return response.data.data
}

async function handleFriendRequest(
	params: FriendActionParams
): Promise<FriendActionResponse> {
	const client = await getMainClient()
	const response = await client.put<FriendActionResponse>(
		`/friends/requests/${params.friendId}`,
		{
			state: params.state,
		}
	)
	return response.data
}

async function removeFriend(friendId: string): Promise<FriendActionResponse> {
	const client = await getMainClient()
	const response = await client.delete<FriendActionResponse>(`/friends/${friendId}`)
	return response.data
}

export function useSendFriendRequest() {
	return useMutation({
		mutationFn: (params: FriendRequestParams) => sendFriendRequest(params),
	})
}

export function useGetFriends(q: GetFriendsParams) {
	if (q.caching) {
		// biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
		return useInfiniteQuery({
			queryKey: ['friends', q.status, q.limit],
			queryFn: async ({ pageParam }) =>
				getFriends({ ...q, page: pageParam as number }),
			retry: 1,
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes
			enabled: q.enabled !== undefined ? q.enabled : true,
			initialPageParam: 1,
			getNextPageParam: (lastPage, allPages) => {
				const currentPage = allPages.length
				return currentPage < lastPage.data.totalPages
					? currentPage + 1
					: undefined
			},
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		})
	} else {
		// biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
		return useInfiniteQuery({
			queryKey: ['friends', q.status, q.limit, 'no-cache'],
			queryFn: async ({ pageParam }) =>
				getFriends({ ...q, page: pageParam as number }),
			retry: 1,
			staleTime: 0,
			gcTime: 0,
			enabled: q.enabled !== undefined ? q.enabled : true,
			initialPageParam: 1,
			getNextPageParam: (lastPage, allPages) => {
				const currentPage = allPages.length
				return currentPage < lastPage.data.totalPages
					? currentPage + 1
					: undefined
			},
			refetchOnWindowFocus: true,
			refetchOnMount: true,
			refetchOnReconnect: true,
		})
	}
}

export function useGetActivities() {
	return useQuery({
		queryKey: ['friends-activities'],
		queryFn: () => getActivities(),
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
}

export function useHandleFriendRequest(
	options?: Partial<
		UseMutationOptions<FriendActionResponse, unknown, FriendActionParams>
	>
) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: handleFriendRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['friends'] })
			queryClient.invalidateQueries({ queryKey: ['userProfile'] })
		},
		...options,
	})
}

export function useRemoveFriend(
	options?: Partial<UseMutationOptions<FriendActionResponse, unknown, string>>
) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: removeFriend,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['friends'] })
		},
		...options,
	})
}
