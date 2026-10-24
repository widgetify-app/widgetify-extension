import {
	type UseMutationOptions,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import type { MoodType } from '@/services/mood-log/upsert-mood-log.hook'
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
	isBirthdayToday?: boolean
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
	color: string | null
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

type FriendRelation = 'self' | 'none' | 'pending-sent' | 'pending-received' | 'friends'

export interface FriendLookItem {
	value: string
	name: string | null
	itemId: string | null
	price: number
	owned: boolean
}

export interface FriendCard {
	user: { id: string; username: string; name: string; avatar: string }
	relation: FriendRelation
	requestId: string | null
	about: {
		occupation: string | null
		interests: { title: string; shared: boolean }[]
	}
	mutual: {
		count: number
		preview: { username: string; name: string; avatar: string }[]
	}
	friend: null | {
		isPro: boolean
		status: { activityId: string; content: string; color: string | null } | null
		mood: MoodType | null
		city: string | null
		birthday: { month: number; day: number } | null
		memberSince: string
		friendsSince: string | null
		wallpaper: {
			id: string
			name: string
			previewUrl: string
			type: 'IMAGE' | 'VIDEO'
			price: number
			owned: boolean
		} | null
		theme: FriendLookItem | null
		font: FriendLookItem | null
	}
}

function friendCardQuery(username: string) {
	return {
		queryKey: friendsKeys.card(username),
		queryFn: async (): Promise<FriendCard> => {
			const client = getMainClient()
			const response = await client.get<{ data: FriendCard }>(
				`/friends/users/${encodeURIComponent(username)}/card`
			)
			return response.data.data
		},
		retry: 1,
		staleTime: 60 * 1000,
	}
}

export function useGetFriendCard(username: string, enabled: boolean) {
	return useQuery({ ...friendCardQuery(username), enabled })
}

export function usePrefetchFriendCard() {
	const queryClient = useQueryClient()
	return (username: string) => queryClient.prefetchQuery(friendCardQuery(username))
}

export interface FriendSuggestion {
	user: { id: string; username: string; name: string; avatar: string }
	reasons: { mutualCount: number; sharedInterests: string[]; city: string | null }
}

export function useGetFriendSuggestions(enabled: boolean) {
	return useQuery({
		queryKey: friendsKeys.suggestions,
		enabled,
		queryFn: async (): Promise<FriendSuggestion[]> => {
			const client = getMainClient()
			const response = await client.get<{
				data: { suggestions: FriendSuggestion[] }
			}>('/friends/suggestions')
			return response.data.data.suggestions
		},
		retry: 1,
		staleTime: 5 * 60 * 1000,
	})
}

interface FriendPrivacy {
	hiddenFromSuggestions: boolean
}

export function useGetFriendPrivacy(enabled: boolean) {
	return useQuery({
		queryKey: friendsKeys.privacy,
		enabled,
		queryFn: async (): Promise<FriendPrivacy> => {
			const client = getMainClient()
			const response = await client.get<{ data: FriendPrivacy }>('/friends/privacy')
			return response.data.data
		},
		retry: 1,
	})
}

export function useUpdateFriendPrivacy() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (input: FriendPrivacy): Promise<FriendPrivacy> => {
			const client = getMainClient()
			const response = await client.put<{ data: FriendPrivacy }>(
				'/friends/privacy',
				input
			)
			return response.data.data
		},
		onSuccess: (data) => {
			queryClient.setQueryData(friendsKeys.privacy, data)
		},
	})
}

export function useCongratulateFriend() {
	return useMutation({
		mutationFn: async (username: string) => {
			const client = getMainClient()
			await client.post(
				`/friends/users/${encodeURIComponent(username)}/congratulate`
			)
		},
	})
}
