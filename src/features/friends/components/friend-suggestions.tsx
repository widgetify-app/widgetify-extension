import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { getFromStorage, setToStorage } from '@/common/storage'
import { showToast } from '@/common/toast'
import { cn } from '@/common/utils/cn'
import { translateError } from '@/common/utils/translate-error'
import { AvatarComponent, Button } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import {
	type FriendSuggestion,
	useGetFriendSuggestions,
	useSendFriendRequest,
} from '@/services/friends/friend-service.hook'
import { friendsKeys } from '@/services/friends/friends.keys'
import { suggestionReason } from '../utils/suggestion-reason'
import { ProfileCardTrigger } from './profile-card/profile-card-trigger'

export function useFriendSuggestionList() {
	const [dismissed, setDismissed] = useState<string[] | null>(null)
	const { data } = useGetFriendSuggestions(dismissed !== null)

	useEffect(() => {
		getFromStorage('friendSuggestionsDismissed').then((ids) =>
			setDismissed(ids ?? [])
		)
	}, [])

	const items = (data ?? []).filter((item) => !dismissed?.includes(item.user.id))

	const dismiss = (id: string) => {
		const next = [...(dismissed ?? []), id]
		setDismissed(next)
		setToStorage('friendSuggestionsDismissed', next)
		Analytics.event('friends_suggestion_dismissed')
	}

	return { items, dismiss }
}

function FirstReward() {
	const { user } = useAuth()
	if (user?.friendshipStats?.accepted !== 0) return null

	return (
		<span className="shrink-0 text-3xs text-fg-faint">
			{t('friends.suggestions.firstReward')}
		</span>
	)
}

const BUBBLE_FACES = [
	['top-3 left-3 w-10 h-10'],
	['top-2.5 left-1.5 w-9 h-9', 'bottom-2.5 right-1.5 w-9 h-9'],
	['top-1.5 left-4.5 w-7 h-7', 'bottom-2 left-2 w-7 h-7', 'bottom-2 right-2 w-7 h-7'],
]

export function FriendSuggestionsBubble({
	items,
	onOpen,
}: {
	items: FriendSuggestion[]
	onOpen: () => void
}) {
	if (!items.length) return null

	const faces = items.slice(0, BUBBLE_FACES.length)
	const layout = BUBBLE_FACES[faces.length - 1]
	const others = items.length - faces.length

	return (
		<button
			type="button"
			onClick={onOpen}
			aria-label={t('friends.suggestions.open')}
			className="flex flex-col items-center justify-end pt-4 cursor-pointer shrink-0 group rounded-xl focus-visible:focus-ring"
		>
			<span className="relative w-16 h-16 rounded-full bg-fill-2 ring-2 ring-surface-3 transition-ui group-hover:bg-fill-3 group-hover:ring-brand-muted group-active:scale-95">
				{faces.map((item, index) => (
					<AvatarComponent
						key={item.user.id}
						url={item.user.avatar}
						placeholder={item.user.name}
						size="xs"
						className={cn(
							'absolute rounded-full ring-2 ring-surface-2',
							layout[index]
						)}
					/>
				))}
				{others > 0 && (
					<span className="absolute px-1.5 font-bold -translate-x-1/2 rounded-full -bottom-1 left-1/2 text-3xs leading-4 bg-brand text-on-brand ring-2 ring-surface">
						{t('friends.suggestions.count', { count: others })}
					</span>
				)}
			</span>
			<span className="w-full px-1 mt-2 text-xs font-medium text-center truncate max-w-20 text-fg">
				{t('friends.suggestions.bubble')}
			</span>
		</button>
	)
}

export function FriendSuggestionsView({
	items,
	onDismiss,
	onBack,
}: {
	items: FriendSuggestion[]
	onDismiss: (id: string) => void
	onBack: () => void
}) {
	return (
		<div className="flex flex-col flex-1 min-h-0">
			<div className="flex items-center gap-1.5 px-1 pt-2 pb-1 shrink-0">
				<button
					type="button"
					onClick={onBack}
					aria-label={t('friends.suggestions.back')}
					className="flex items-center justify-center cursor-pointer size-8 rounded-xl text-fg-muted transition-ui hover:bg-fill-2 hover:text-fg-strong focus-visible:focus-ring"
				>
					<Icon name="chevronRight" size={16} />
				</button>
				<h3 className="flex-1 min-w-0 text-sm font-medium truncate text-fg-strong">
					{t('friends.suggestions.title')}
				</h3>
				<FirstReward />
			</div>

			<ul className="flex-1 px-1 py-1.5 space-y-1 overflow-y-auto scrollbar-none">
				{items.map((item) => (
					<SuggestionRow
						key={item.user.id}
						item={item}
						onDismiss={() => onDismiss(item.user.id)}
					/>
				))}
			</ul>
		</div>
	)
}

function SuggestionRow({
	item,
	onDismiss,
}: {
	item: FriendSuggestion
	onDismiss: () => void
}) {
	const queryClient = useQueryClient()
	const sendRequest = useSendFriendRequest()
	const reason = suggestionReason(item.reasons)

	const reasonText =
		reason?.kind === 'mutual'
			? t('friends.suggestions.mutual', { count: reason.value })
			: reason?.kind === 'interest'
				? t('friends.suggestions.interest', { title: reason.value })
				: reason?.kind === 'city'
					? t('friends.suggestions.city')
					: ''

	const add = () =>
		sendRequest.mutate(
			{ username: item.user.username },
			{
				onSuccess: () => {
					Analytics.event('friends_suggestion_added')
					showToast(
						t('friends.suggestions.sent', { name: item.user.name }),
						'success'
					)
					queryClient.invalidateQueries({ queryKey: friendsKeys.suggestions })
				},
				onError: (error) => {
					const message = translateError(error)
					showToast(
						typeof message === 'string'
							? message
							: t('friends.card.loadFailed'),
						'error'
					)
				},
			}
		)

	return (
		<li className="flex items-center gap-1.5 p-2 rounded-xl transition-ui hover:bg-fill-2">
			<ProfileCardTrigger
				username={item.user.username}
				name={item.user.name}
				className="flex items-center flex-1 min-w-0 gap-2.5 rounded-lg"
			>
				<AvatarComponent
					url={item.user.avatar}
					placeholder={item.user.name}
					size="sm"
					className="rounded-full shrink-0"
				/>
				<span className="flex-1 min-w-0">
					<span className="block text-xs font-medium truncate text-fg-strong">
						{item.user.name}
					</span>
					<span className="block truncate text-3xs text-fg-faint">
						{reasonText}
					</span>
				</span>
			</ProfileCardTrigger>

			<Button
				size="xs"
				rounded="lg"
				variant="soft"
				color="brand"
				loading={sendRequest.isPending}
				onClick={add}
			>
				{t('friends.suggestions.add')}
			</Button>
			<button
				type="button"
				onClick={onDismiss}
				aria-label={t('friends.suggestions.dismissAria', {
					name: item.user.name,
				})}
				className="flex items-center justify-center rounded-lg cursor-pointer size-6 shrink-0 text-fg-faint transition-ui hover:bg-fill-3 hover:text-fg-strong focus-visible:focus-ring"
			>
				<Icon name="close" size={12} />
			</button>
		</li>
	)
}
