import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { getFromStorage, setToStorage } from '@/common/storage'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { AvatarComponent, Button, ScrollRow } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import {
	type FriendSuggestion,
	useGetFriendSuggestions,
	useSendFriendRequest,
} from '@/services/friends/friend-service.hook'
import { friendsKeys } from '@/services/friends/friends.keys'
import { suggestionReason } from '../utils/suggestion-reason'
import { ProfileCardTrigger } from './profile-card/profile-card-trigger'

export function FriendSuggestions() {
	const { user } = useAuth()
	const [dismissed, setDismissed] = useState<string[] | null>(null)
	const { data } = useGetFriendSuggestions(dismissed !== null)

	useEffect(() => {
		getFromStorage('friendSuggestionsDismissed').then((ids) =>
			setDismissed(ids ?? [])
		)
	}, [])

	const visible = (data ?? []).filter((item) => !dismissed?.includes(item.user.id))
	if (!visible.length) return null

	const dismiss = (id: string) => {
		const next = [...(dismissed ?? []), id]
		setDismissed(next)
		setToStorage('friendSuggestionsDismissed', next)
		Analytics.event('friends_suggestion_dismissed')
	}

	return (
		<section
			aria-label={t('friends.suggestions.title')}
			className="pt-2.5 pb-2 border-b shrink-0 border-line"
		>
			<div className="flex items-baseline justify-between gap-2 px-2 pb-1.5">
				<span className="text-xs font-medium text-fg-muted">
					{t('friends.suggestions.title')}
				</span>
				{user?.friendshipStats?.accepted === 0 && (
					<span className="text-3xs text-fg-faint">
						{t('friends.suggestions.firstReward')}
					</span>
				)}
			</div>

			<ScrollRow gap="sm">
				{visible.map((item) => (
					<SuggestionCard
						key={item.user.id}
						item={item}
						onDismiss={() => dismiss(item.user.id)}
					/>
				))}
			</ScrollRow>
		</section>
	)
}

function SuggestionCard({
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
					? t('friends.suggestions.city', { city: reason.value })
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
		<div className="flex flex-col items-center gap-1.5 p-2 border w-28 shrink-0 rounded-2xl border-line bg-fill">
			<ProfileCardTrigger
				username={item.user.username}
				name={item.user.name}
				className="flex flex-col items-center w-full min-w-0 gap-1"
			>
				<AvatarComponent
					url={item.user.avatar}
					placeholder={item.user.name}
					size="md"
				/>
				<span className="w-full text-xs font-medium text-center truncate text-fg-strong">
					{item.user.name}
				</span>
				<span className="w-full text-center truncate text-3xs text-fg-faint">
					{reasonText}
				</span>
			</ProfileCardTrigger>

			<div className="flex w-full gap-1">
				<Button
					size="xs"
					rounded="lg"
					color="brand"
					className="flex-1"
					loading={sendRequest.isPending}
					onClick={add}
				>
					{t('friends.suggestions.add')}
				</Button>
				<Button
					size="xs"
					rounded="lg"
					variant="ghost"
					aria-label={t('friends.suggestions.dismissAria', {
						name: item.user.name,
					})}
					onClick={onDismiss}
				>
					{t('friends.suggestions.dismiss')}
				</Button>
			</div>
		</div>
	)
}
