import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { translateError } from '@/common/utils/translate-error'
import { Button } from '@/components/ui'
import {
	type FriendCard,
	useHandleFriendRequest,
	useRemoveFriend,
	useSendFriendRequest,
} from '@/services/friends/friend-service.hook'
import { friendsKeys } from '@/services/friends/friends.keys'

function showError(error: unknown) {
	const message = translateError(error)
	showToast(
		typeof message === 'string' ? message : t('friends.card.loadFailed'),
		'error'
	)
}

export function ProfileCardActions({ card }: { card: FriendCard }) {
	const queryClient = useQueryClient()
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false)
	const sendRequest = useSendFriendRequest()
	const answerRequest = useHandleFriendRequest()
	const removeFriend = useRemoveFriend()
	const { relation, requestId, user } = card

	const refreshCard = () =>
		queryClient.invalidateQueries({ queryKey: friendsKeys.card(user.username) })

	if (relation === 'self') {
		return (
			<Button
				size="sm"
				rounded="xl"
				onClick={() => callEvent('openSettings', 'profile')}
			>
				{t('friends.card.editProfile')}
			</Button>
		)
	}

	if (relation === 'none') {
		return (
			<Button
				size="sm"
				rounded="xl"
				color="brand"
				loading={sendRequest.isPending}
				onClick={() =>
					sendRequest.mutate(
						{ username: user.username },
						{
							onSuccess: () => {
								Analytics.event('friends_card_request_sent')
								showToast(t('friends.card.requestSent'), 'success')
								refreshCard()
							},
							onError: showError,
						}
					)
				}
			>
				{t('friends.card.request')}
			</Button>
		)
	}

	if (!requestId) return null

	if (relation === 'pending-sent') {
		return (
			<Button
				size="sm"
				rounded="xl"
				loading={removeFriend.isPending}
				onClick={() =>
					removeFriend.mutate(requestId, {
						onSuccess: () =>
							Analytics.event('friends_card_request_cancelled'),
						onError: showError,
					})
				}
			>
				{t('friends.card.pendingCancel')}
			</Button>
		)
	}

	if (relation === 'pending-received') {
		const answer = (state: 'accepted' | 'rejected') =>
			answerRequest.mutate(
				{ friendId: requestId, state },
				{
					onSuccess: () =>
						Analytics.event(
							state === 'accepted'
								? 'friends_request_accepted'
								: 'friends_request_declined'
						),
					onError: showError,
				}
			)

		return (
			<div className="flex gap-1.5">
				<Button
					size="sm"
					rounded="xl"
					color="brand"
					className="flex-1"
					loading={answerRequest.isPending}
					onClick={() => answer('accepted')}
				>
					{t('friends.card.accept')}
				</Button>
				<Button
					size="sm"
					rounded="xl"
					variant="ghost"
					disabled={answerRequest.isPending}
					onClick={() => answer('rejected')}
				>
					{t('friends.card.reject')}
				</Button>
			</div>
		)
	}

	return (
		<div className="flex items-center justify-between gap-2">
			<span className="text-xs font-semibold text-brand">
				✓ {t('friends.card.friends')}
			</span>
			<Button
				size="xs"
				rounded="lg"
				variant="ghost"
				color={isConfirmingRemove ? 'danger' : 'base'}
				loading={removeFriend.isPending}
				onClick={() => {
					if (!isConfirmingRemove) return setIsConfirmingRemove(true)

					removeFriend.mutate(requestId, {
						onSuccess: () => Analytics.event('friends_removed'),
						onError: showError,
					})
				}}
			>
				{isConfirmingRemove
					? t('friends.card.removeConfirm')
					: t('friends.card.remove')}
			</Button>
		</div>
	)
}
