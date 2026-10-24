import { useState } from 'react'
import Analytics from '@/analytics'
import {
	type Friend,
	useGetFriends,
	useRemoveFriend,
} from '@/services/friends/friend-service.hook'
import {
	AvatarComponent,
	Button,
	ConfirmationModal,
	EmptyState,
	Spinner,
} from '@/components/ui'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { Icon } from '@/icons'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { useAuth } from '@/context/auth.context'
import { ActiveFriendsHorizontal } from './activities'
import { AddFriendBottomSheet } from './add-friend-bottom-sheet'
import { FriendRequestsButton } from './friend-requests-button'
import { BirthdayBadge, CongratulateButton } from './congratulate-button'
import {
	FriendSuggestionsBubble,
	FriendSuggestionsView,
	useFriendSuggestionList,
} from './friend-suggestions'
import { ProfileCardTrigger } from './profile-card/profile-card-trigger'

export function FriendsDirectView() {
	const { user } = useAuth()
	const [selectedUserToDelete, setSelectedUserToDelete] = useState<Friend | null>(null)
	const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)
	const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
	const suggestions = useFriendSuggestionList()
	const showSuggestions = isSuggestionsOpen && suggestions.items.length > 0

	const {
		data: friendsData,
		isLoading,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useGetFriends({
		status: 'ACCEPTED',
		limit: 12,
		caching: true,
	})

	const { mutate: removeFriend, isPending: isRemoving } = useRemoveFriend()

	const { containerRef, loadMoreRef } = useInfiniteScroll({
		hasNextPage: hasNextPage ?? false,
		isFetchingNextPage,
		fetchNextPage,
		direction: 'vertical',
		threshold: 0.1,
	})

	const allFriends = friendsData?.pages.flatMap((page) => page.data.friends) || []

	const handleRemoveFriend = (friendId: string | null) => {
		if (!friendId) return

		removeFriend(friendId, {
			onError: (error) => {
				const msg = translateError(error)
				showToast(msg as string, 'error')
			},
			onSuccess: () => {
				Analytics.event('friends_removed')
				setSelectedUserToDelete(null)
			},
		})
	}

	return (
		<div className="flex flex-col h-full overflow-hidden text-right" dir="rtl">
			{showSuggestions && (
				<FriendSuggestionsView
					items={suggestions.items}
					onDismiss={suggestions.dismiss}
					onBack={() => setIsSuggestionsOpen(false)}
				/>
			)}

			<div
				className={cn(
					'flex flex-col flex-1 min-h-0',
					showSuggestions && 'hidden'
				)}
			>
				<section
					aria-label={t('friends.direct.statuses')}
					className="shrink-0 pb-1"
				>
					<ActiveFriendsHorizontal
						trailing={
							<FriendSuggestionsBubble
								items={suggestions.items}
								onOpen={() => {
									Analytics.event('friends_suggestions_opened')
									setIsSuggestionsOpen(true)
								}}
							/>
						}
					/>
				</section>

				<div className="flex items-center justify-between px-2 pt-2.5 pb-1.5 shrink-0">
					<div className="flex items-center gap-1.5">
						<span className="text-xs font-medium text-fg-muted">
							{t('friends.direct.friends')}
						</span>
					</div>

					<div className="flex items-center gap-1.5">
						<FriendRequestsButton
							size="small"
							pendingCount={user?.friendshipStats?.pending || 0}
						/>
						<button
							type="button"
							onClick={() => setIsAddFriendOpen(true)}
							className="flex items-center justify-center w-8 h-8 transition-ui rounded-xl bg-fill hover:bg-fill-2 active:scale-90 cursor-pointer border border-line text-fg-muted hover:text-fg-strong"
							aria-label={t('friends.direct.add')}
						>
							<Icon name="usersPlus" size={16} />
						</button>
					</div>
				</div>

				<div
					ref={containerRef}
					className="flex-1 px-1 pb-2 overflow-y-auto space-y-1 scrollbar-none"
				>
					{isLoading ? (
						<div className="space-y-1.5 pt-1">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between p-2 rounded-xl border border-line bg-fill animate-pulse"
								>
									<div className="flex items-center gap-2.5">
										<div className="w-8 h-8 rounded-full skeleton" />
										<div className="space-y-1">
											<div className="w-20 h-3 rounded-sm skeleton" />
											<div className="w-14 h-2 rounded-sm skeleton" />
										</div>
									</div>
								</div>
							))}
						</div>
					) : allFriends.length === 0 ? (
						<EmptyState
							icon="users"
							title={t('friends.direct.empty')}
							description={t('friends.direct.emptyHint')}
							className="py-6"
							action={
								<div className="flex flex-wrap justify-center gap-2">
									<Button
										size="sm"
										rounded="xl"
										color="brand"
										icon={<Icon name="usersPlus" size={14} />}
										onClick={() => setIsAddFriendOpen(true)}
									>
										{t('friends.direct.addFirst')}
									</Button>
									{suggestions.items.length > 0 && (
										<Button
											size="sm"
											rounded="xl"
											variant="soft"
											color="brand"
											onClick={() => setIsSuggestionsOpen(true)}
										>
											{t('friends.direct.seeSuggestions')}
										</Button>
									)}
								</div>
							}
						/>
					) : (
						<>
							{allFriends.map((friend) => (
								<div
									key={`friend-direct-${friend.id}`}
									className="group flex items-center justify-between p-2 transition-colors duration-150 rounded-xl hover:bg-fill-2 border border-transparent hover:border-line"
								>
									<ProfileCardTrigger
										username={friend.user.username}
										name={friend.user.name}
										className="flex items-center gap-2.5 min-w-0 flex-1 rounded-lg"
									>
										<div className="relative shrink-0">
											<div className="w-8 h-8 overflow-hidden rounded-full ring-1 ring-line">
												<AvatarComponent
													url={friend.user.avatar}
													placeholder={friend.user.name}
													size="sm"
													className="object-cover w-full h-full"
												/>
											</div>
											{friend.user.isBirthdayToday && (
												<BirthdayBadge />
											)}
										</div>

										<div className="min-w-0 flex-1">
											<div className="text-xs font-medium truncate text-fg-strong">
												{friend.user.name}
											</div>
											<div className="text-3xs truncate text-fg-faint">
												<span dir="ltr">
													@{friend.user.username}
												</span>
											</div>
										</div>
									</ProfileCardTrigger>

									{friend.user.isBirthdayToday && (
										<CongratulateButton
											username={friend.user.username}
											name={friend.user.name}
											className="shrink-0 me-1"
										/>
									)}

									<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation()
												setSelectedUserToDelete(friend)
											}}
											className="p-1 text-fg-faint hover:text-danger hover:bg-danger-fill rounded-lg transition-colors cursor-pointer"
											aria-label={t('friends.direct.remove')}
										>
											<Icon name="trash" size={12} />
										</button>
									</div>
								</div>
							))}

							<div ref={loadMoreRef} className="h-1" />

							{isFetchingNextPage && (
								<div className="flex justify-center py-1.5">
									<Spinner size="sm" />
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{isAddFriendOpen && (
				<AddFriendBottomSheet
					isOpen={isAddFriendOpen}
					onClose={() => setIsAddFriendOpen(false)}
				/>
			)}

			<ConfirmationModal
				isOpen={Boolean(selectedUserToDelete)}
				isLoading={isRemoving}
				onClose={() => setSelectedUserToDelete(null)}
				onConfirm={() => handleRemoveFriend(selectedUserToDelete?.id || null)}
				title={t('ui.common.areYouSure')}
				message={t('friends.direct.removeConfirm', {
					name: selectedUserToDelete?.user.name ?? '',
				})}
				confirmText={t('ui.common.confirm')}
				cancelText={t('ui.common.cancel')}
			/>
		</div>
	)
}
