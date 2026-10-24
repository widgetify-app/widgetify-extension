import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { translateError } from '@/common/utils/translate-error'
import { cn } from '@/common/utils/cn'
import { Button, PopoverMenuItem, popoverMenuVariants, Tooltip } from '@/components/ui'
import { Icon } from '@/icons'
import {
	type FriendCard,
	useHandleFriendRequest,
	useRemoveFriend,
	useSendFriendRequest,
} from '@/services/friends/friend-service.hook'
import { friendsKeys } from '@/services/friends/friends.keys'
import { birthdayParts } from '../../utils/profile-card'
import { CongratulateButton } from '../congratulate-button'

function showError(error: unknown) {
	const message = translateError(error)
	showToast(
		typeof message === 'string' ? message : t('friends.card.loadFailed'),
		'error'
	)
}

export function ProfileCardMenu({ card }: { card: FriendCard }) {
	const menuRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(false)
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false)
	const removeFriend = useRemoveFriend()
	const { relation, requestId } = card

	useEffect(() => {
		if (!isOpen) return

		const closeOutside = (event: MouseEvent) => {
			if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false)
		}
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return
			event.stopPropagation()
			setIsOpen(false)
		}

		document.addEventListener('mousedown', closeOutside)
		document.addEventListener('keydown', closeOnEscape, true)
		return () => {
			document.removeEventListener('mousedown', closeOutside)
			document.removeEventListener('keydown', closeOnEscape, true)
		}
	}, [isOpen])

	if (relation !== 'self' && !(relation === 'friends' && requestId)) return null

	return (
		<div ref={menuRef} className="relative">
			<Tooltip content={isOpen ? null : t('friends.card.menu')}>
				<button
					type="button"
					aria-haspopup="menu"
					aria-expanded={isOpen}
					aria-label={t('friends.card.menu')}
					onClick={() => {
						setIsOpen(!isOpen)
						setIsConfirmingRemove(false)
					}}
					className="grid rounded-full cursor-pointer size-8 place-items-center bg-scrim-soft text-image-fg transition-ui hover:bg-scrim focus-visible:focus-ring"
				>
					<Icon name="menuOption" size={16} />
				</button>
			</Tooltip>

			{isOpen && (
				<div
					role="menu"
					className={cn(
						popoverMenuVariants(),
						'absolute end-0 top-10 z-10 w-44'
					)}
				>
					{relation === 'self' ? (
						<PopoverMenuItem
							icon={<Icon name="pen" size={14} />}
							label={t('friends.card.editProfile')}
							onClick={() => {
								setIsOpen(false)
								callEvent('openSettings', 'profile')
							}}
						/>
					) : (
						<PopoverMenuItem
							variant="danger"
							icon={<Icon name="userX" size={14} />}
							label={
								isConfirmingRemove
									? t('friends.card.removeConfirm')
									: t('friends.card.remove')
							}
							disabled={removeFriend.isPending}
							onClick={() => {
								if (!isConfirmingRemove)
									return setIsConfirmingRemove(true)
								if (!requestId) return

								removeFriend.mutate(requestId, {
									onSuccess: () => {
										Analytics.event('friends_removed')
										setIsOpen(false)
									},
									onError: showError,
								})
							}}
						/>
					)}
				</div>
			)}
		</div>
	)
}

export function ProfileCardActions({ card }: { card: FriendCard }) {
	const queryClient = useQueryClient()
	const sendRequest = useSendFriendRequest()
	const answerRequest = useHandleFriendRequest()
	const removeFriend = useRemoveFriend()
	const { relation, requestId, user } = card

	const refreshCard = () =>
		queryClient.invalidateQueries({ queryKey: friendsKeys.card(user.username) })

	if (relation === 'self') return null

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

	const isBirthday = card.friend?.birthday
		? birthdayParts(card.friend.birthday, new Date()).isToday
		: false

	if (!isBirthday) return null

	return (
		<CongratulateButton
			username={user.username}
			name={user.name}
			className="w-full h-8"
		/>
	)
}
