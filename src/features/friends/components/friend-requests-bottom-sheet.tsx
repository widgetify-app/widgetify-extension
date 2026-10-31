import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { AvatarComponent, Button, EmptyState, Modal, Spinner } from '@/components/ui'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { Icon } from '@/icons'
import {
	type Friend,
	useGetFriends,
	useHandleFriendRequest,
	useRemoveFriend,
} from '@/services/friends/friend-service.hook'
import { ProfileCardTrigger } from './profile-card/profile-card-trigger'

interface Prop {
	isOpen: boolean
	onClose: () => void
}

function showError(error: unknown) {
	const message = translateError(error)
	showToast(
		typeof message === 'string' ? message : t('friends.requests.error'),
		'error'
	)
}

export const FriendRequestsBottomSheet = ({ isOpen, onClose }: Prop) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			title={t('friends.requests.title')}
			closeOnBackdropClick
			closeLabel={t('ui.common.close')}
		>
			{isOpen && <FriendRequests />}
		</Modal>
	)
}

function FriendRequests() {
	const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
		useGetFriends({ status: 'PENDING', limit: 20, caching: false })

	const { containerRef, loadMoreRef } = useInfiniteScroll({
		hasNextPage: hasNextPage ?? false,
		isFetchingNextPage,
		fetchNextPage,
		direction: 'vertical',
		threshold: 0.1,
	})

	const requests = data?.pages.flatMap((page) => page.data.friends) ?? []
	const sorted = [
		...requests.filter((request) => !request.sendByMe),
		...requests.filter((request) => request.sendByMe),
	]

	if (isLoading) {
		return (
			<div className="space-y-1.5" aria-busy="true">
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className="h-14 rounded-xl skeleton bg-fill-2" />
				))}
			</div>
		)
	}

	if (!sorted.length) {
		return (
			<EmptyState
				icon="allCaughtUp"
				title={t('friends.requests.empty')}
				description={t('friends.requests.emptyHint')}
				className="py-8"
			/>
		)
	}

	return (
		<div ref={containerRef} className="overflow-y-auto max-h-96 scrollbar-none">
			<ul className="flex flex-col gap-1">
				{sorted.map((request) => (
					<RequestRow key={request.id} request={request} />
				))}
			</ul>
			{hasNextPage && (
				<div ref={loadMoreRef} className="flex justify-center py-2">
					{isFetchingNextPage && <Spinner size="sm" />}
				</div>
			)}
		</div>
	)
}

function RequestRow({ request }: { request: Friend }) {
	const answer = useHandleFriendRequest()
	const cancel = useRemoveFriend()
	const { user } = request
	const isBusy = answer.isPending || cancel.isPending

	const respond = (state: 'accepted' | 'rejected') =>
		answer.mutate(
			{ friendId: request.id, state },
			{
				onSuccess: () => {
					if (state === 'rejected') {
						Analytics.event('friends_request_declined')
						return
					}
					Analytics.event('friends_request_accepted')
					showToast(t('friends.requests.nowFriends'), 'success')
				},
				onError: showError,
			}
		)

	return (
		<li className="flex items-center gap-2 p-2 rounded-xl transition-ui hover:bg-fill">
			<ProfileCardTrigger
				username={user.username}
				name={user.name}
				className="flex items-center flex-1 min-w-0 gap-2.5 rounded-lg"
			>
				<AvatarComponent
					url={user.avatar}
					placeholder={user.name}
					size="md"
					className="rounded-full shrink-0"
				/>
				<span className="flex-1 min-w-0">
					<span className="block text-sm font-medium truncate text-fg-strong">
						{user.name}
					</span>
					<span className="block text-xs truncate text-fg-faint">
						{request.sendByMe ? (
							t('friends.requests.waiting')
						) : (
							<span dir="ltr">@{user.username}</span>
						)}
					</span>
				</span>
			</ProfileCardTrigger>

			{request.sendByMe ? (
				<Button
					size="xs"
					rounded="lg"
					variant="ghost"
					color="base"
					aria-label={t('friends.requests.cancelAria', { name: user.name })}
					loading={cancel.isPending}
					onClick={() =>
						cancel.mutate(request.id, {
							onSuccess: () =>
								Analytics.event('friends_card_request_cancelled'),
							onError: showError,
						})
					}
				>
					{t('friends.requests.cancel')}
				</Button>
			) : (
				<div className="flex items-center gap-1 shrink-0">
					<Button
						size="xs"
						rounded="lg"
						color="brand"
						loading={
							answer.isPending && answer.variables?.state === 'accepted'
						}
						disabled={isBusy}
						icon={<Icon name="userCheck" size={14} />}
						onClick={() => respond('accepted')}
					>
						{t('friends.requests.accept')}
					</Button>
					<Button
						size="xs"
						rounded="lg"
						variant="ghost"
						color="base"
						aria-label={t('friends.requests.declineAria', {
							name: user.name,
						})}
						loading={
							answer.isPending && answer.variables?.state === 'rejected'
						}
						disabled={isBusy}
						onClick={() => respond('rejected')}
					>
						{t('friends.requests.remove')}
					</Button>
				</div>
			)}
		</li>
	)
}
