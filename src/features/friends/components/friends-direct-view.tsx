import { useRef, useState } from 'react'
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
	PopoverMenu,
	PopoverMenuItem,
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
import { MoodBadge } from './mood-badge'
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
								<FriendRow
									key={`friend-direct-${friend.id}`}
									friend={friend}
									onRemove={() => setSelectedUserToDelete(friend)}
								/>
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

function FriendRow({ friend, onRemove }: { friend: Friend; onRemove: () => void }) {
	const menuRef = useRef<HTMLButtonElement>(null)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { user } = friend

	return (
		<div className="flex items-center gap-1.5 p-2 group rounded-xl transition-ui hover:bg-fill-2">
			<ProfileCardTrigger
				username={user.username}
				name={user.name}
				className="flex items-center flex-1 min-w-0 gap-2.5 rounded-lg"
			>
				<span className="relative shrink-0">
					<AvatarComponent
						url={user.avatar}
						placeholder={user.name}
						size="md"
						isPro={Boolean(user.isPro)}
					/>
					{user.mood && <MoodBadge mood={user.mood} size="sm" />}
					{user.isBirthdayToday && <BirthdayBadge />}
				</span>

				<span className="flex-1 min-w-0">
					<span className="block text-sm font-medium truncate text-fg-strong">
						{user.name}
					</span>
					<span
						dir="ltr"
						className="block text-xs truncate text-fg-faint text-end"
					>
						@{user.username}
					</span>
				</span>
			</ProfileCardTrigger>

			{user.isBirthdayToday && (
				<CongratulateButton
					username={user.username}
					name={user.name}
					className="shrink-0"
				/>
			)}

			<button
				ref={menuRef}
				type="button"
				aria-haspopup="menu"
				aria-expanded={isMenuOpen}
				aria-label={t('friends.direct.more', { name: user.name })}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				className={cn(
					'grid rounded-lg cursor-pointer size-7 shrink-0 place-items-center text-fg-faint transition-ui hover:bg-fill-3 hover:text-fg-strong focus-visible:focus-ring',
					!isMenuOpen &&
						'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
				)}
			>
				<Icon name="menuOption" size={14} />
			</button>

			<PopoverMenu
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				triggerRef={menuRef}
				placement="bottom-start"
				width={176}
			>
				<PopoverMenuItem
					variant="danger"
					icon={<Icon name="userX" size={14} />}
					label={t('friends.direct.remove')}
					onClick={() => {
						setIsMenuOpen(false)
						onRemove()
					}}
				/>
			</PopoverMenu>
		</div>
	)
}
