import {
	type UseMutationOptions,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { getMainClient } from '../api'
import { friendsKeys } from '@/services/friends/friends.keys'
import { userKeys } from '@/services/user/user.keys'

interface FriendRequestParams {
	username: string
}

interface FriendRequestResponse {
	data: null
	message: string
}

interface FriendUser {
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

interface FriendsResponse {
	data: {
		friends: Friend[]
		totalPages: number
	}
}

interface UserActivity {
	name: string
	username: string
	avatar: string
	activityId: string
	content: string
	isSelf: boolean
	reactionCount: number
}
export const ReactionKey = {
	CRYING: 'CRYING',
	HEART_BLUE: 'HEART_BLUE',
	LIKE: 'LIKE',
	DIS_LIKE: 'DIS_LIKE',
	LAUGH: 'LAUGH',
	FIRE: 'FIRE',
} as const

export type ReactionKey = (typeof ReactionKey)[keyof typeof ReactionKey]

export interface AttachmentReaction {
	id: ReactionKey
	isEmoji: boolean
	content: string //emoji
}
interface ActivitiesResponse {
	activities: UserActivity[]
	currentUser: UserActivity | null
	attachments: {
		reactions: AttachmentReaction[]
		templates: string[]
	}
}

interface ActivityReactionItem {
	username: string | null
	avatar: string | null
	name: string
	createdAt: string
	reaction: string
}
interface GetActivityReactionResponse {
	reactions: ActivityReactionItem[]
	currentUser: Pick<ActivityReactionItem, 'reaction' | 'createdAt'>
	isOwnedActivity: boolean
}

interface GetFriendsParams {
	status: 'PENDING' | 'ACCEPTED'
	page?: number
	limit?: number
	enabled?: boolean
	caching: boolean
}

interface FriendActionParams {
	friendId: string
	state: 'accepted' | 'rejected'
}

interface FriendActionResponse {
	message: string
}

async function sendFriendRequest(
	params: FriendRequestParams
): Promise<FriendRequestResponse> {
	const client = getMainClient()
	const response = await client.post<FriendRequestResponse>('/friends/requests', params)
	return response.data
}

async function getFriends(params: GetFriendsParams): Promise<FriendsResponse> {
	const { status, page, limit } = params
	const client = getMainClient()

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
	const client = getMainClient()
	const response = await client.get<{ data: ActivitiesResponse }>(
		`/friends/activities/beta`
	)
	return response.data.data
}

async function handleFriendRequest(
	params: FriendActionParams
): Promise<FriendActionResponse> {
	const client = getMainClient()
	const response = await client.put<FriendActionResponse>(
		`/friends/requests/${params.friendId}`,
		{
			state: params.state,
		}
	)
	return response.data
}

async function removeFriend(friendId: string): Promise<FriendActionResponse> {
	const client = getMainClient()
	const response = await client.delete<FriendActionResponse>(`/friends/${friendId}`)
	return response.data
}

export function useSendFriendRequest() {
	return useMutation({
		mutationFn: (params: FriendRequestParams) => sendFriendRequest(params),
	})
}

export function useGetFriends(q: GetFriendsParams) {
	const cached = Boolean(q.caching)
	return useInfiniteQuery({
		queryKey: cached
			? friendsKeys.list(q.status, q.limit)
			: friendsKeys.uncachedList(q.status, q.limit),
		queryFn: async ({ pageParam }) => getFriends({ ...q, page: pageParam as number }),
		retry: 1,
		staleTime: cached ? 5 * 60 * 1000 : 0,
		gcTime: cached ? 10 * 60 * 1000 : 0,
		enabled: q.enabled !== undefined ? q.enabled : true,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const currentPage = allPages.length
			return currentPage < lastPage.data.totalPages ? currentPage + 1 : undefined
		},
		refetchOnWindowFocus: !cached,
		refetchOnMount: !cached,
		refetchOnReconnect: !cached,
	})
}

export function useGetActivities() {
	return useQuery({
		queryKey: friendsKeys.activities,
		queryFn: () => getActivities(),
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
}

export function useGetActivityReactions(id: string, enabled: boolean) {
	return useQuery({
		queryKey: friendsKeys.activityReactions(id),
		enabled,
		queryFn: async (): Promise<GetActivityReactionResponse> => {
			const client = getMainClient()

			const response = await client.get(`/friends/activities/beta/${id}/reactions`)
			return response.data.data
		},
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
}

export function useUpsertActivityReaction() {
	return useMutation({
		mutationFn: async (input: { reactionKey: string; activityId: string }) => {
			const client = getMainClient()

			await client.put(`/friends/activities/beta/${input.activityId}/reactions`, {
				reaction: input.reactionKey,
			})
		},
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
			queryClient.invalidateQueries({ queryKey: friendsKeys.all })
			queryClient.invalidateQueries({ queryKey: userKeys.profile })
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
			queryClient.invalidateQueries({ queryKey: friendsKeys.all })
		},
		...options,
	})
}
