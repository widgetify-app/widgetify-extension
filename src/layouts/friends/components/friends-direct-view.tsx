import { useState } from 'react'
import {
	type Friend,
	useGetFriends,
	useRemoveFriend,
} from '@/services/hooks/friends/friend-service.hook'
import { AvatarComponent, ConfirmationModal } from '@/components/ui'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { Icon } from '@/icons'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { useAuth } from '@/context/auth.context'
import { ActiveFriendsHorizontal } from './activities'
import { AddFriendBottomSheet } from './add-friend.bottom-sheet'
import { FriendRequestsButton } from './buttons/friend-requests.button'

interface FriendsDirectViewProps {
	onSelectFriend?: (friend: Friend) => void
	onOpenAddFriend?: () => void
}

export function FriendsDirectView({ onSelectFriend }: FriendsDirectViewProps) {
	const { user } = useAuth()
	const [selectedUserToDelete, setSelectedUserToDelete] = useState<Friend | null>(null)
	const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

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
				setSelectedUserToDelete(null)
			},
		})
	}

	return (
		<div className="flex flex-col h-full overflow-hidden text-right" dir="rtl">
			<section
				aria-label="وضعیت‌ها"
				className="shrink-0 pb-2 border-b border-subtle"
			>
				<ActiveFriendsHorizontal />
			</section>

			<div className="flex items-center justify-between px-2 pt-2.5 pb-1.5 shrink-0">
				<div className="flex items-center gap-1.5">
					<span className="text-xs font-medium text-muted">دوستان</span>
				</div>

				<div className="flex items-center gap-1.5">
					<FriendRequestsButton
						size="small"
						pendingCount={user?.friendshipStats?.pending || 0}
					/>
					<button
						type="button"
						onClick={() => setIsAddFriendOpen(true)}
						className="flex items-center justify-center w-8 h-8 transition-all rounded-xl bg-raised hover:bg-hovered active:scale-90 cursor-pointer border border-subtle text-muted hover:text-content"
						title="افزودن دوست"
						aria-label="افزودن دوست"
					>
						<Icon name="usersPlus" size={15} />
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
								className="flex items-center justify-between p-2 rounded-xl border border-subtle bg-content animate-pulse"
							>
								<div className="flex items-center gap-2.5">
									<div className="w-8 h-8 rounded-full skeleton" />
									<div className="space-y-1">
										<div className="w-20 h-3 rounded skeleton" />
										<div className="w-14 h-2 rounded skeleton" />
									</div>
								</div>
							</div>
						))}
					</div>
				) : allFriends.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-6 text-center text-subtle">
						<div className="flex items-center justify-center w-10 h-10 mb-1.5 rounded-xl bg-content text-subtle">
							<Icon name="users" size={18} />
						</div>
						<p className="text-xs font-normal text-muted">هنوز دوستی نداری</p>
						<button
							type="button"
							onClick={() => setIsAddFriendOpen(true)}
							className="mt-1.5 text-[11px] font-medium text-primary hover:underline cursor-pointer"
						>
							اولین دوستت رو اضافه کن
						</button>
					</div>
				) : (
					<>
						{allFriends.map((friend) => (
							<div
								key={`friend-direct-${friend.id}`}
								onClick={() => onSelectFriend?.(friend)}
								className="group flex items-center justify-between p-2 transition-colors duration-150 rounded-xl hover:bg-content border border-transparent hover:border-subtle cursor-pointer"
							>
								<div className="flex items-center gap-2.5 min-w-0 flex-1">
									<div className="relative shrink-0">
										<div className="w-8 h-8 overflow-hidden rounded-full ring-1 ring-subtle">
											<AvatarComponent
												url={friend.user.avatar}
												placeholder={friend.user.name}
												size="sm"
												className="object-cover w-full h-full"
											/>
										</div>
									</div>

									<div className="min-w-0 flex-1">
										<div className="text-xs font-medium truncate text-content">
											{friend.user.name}
										</div>
										<div
											className="text-[10px] truncate text-subtle"
											dir="ltr"
										>
											@{friend.user.username}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation()
											setSelectedUserToDelete(friend)
										}}
										className="p-1 text-subtle hover:text-error hover:bg-danger-subtle rounded-lg transition-colors cursor-pointer"
										title="حذف دوست"
									>
										<Icon name="trash" size={13} />
									</button>
								</div>
							</div>
						))}

						<div ref={loadMoreRef} className="h-1" />

						{isFetchingNextPage && (
							<div className="flex justify-center py-1.5">
								<div className="w-4 h-4 border-2 rounded-full border-brand-muted border-t-primary animate-spin" />
							</div>
						)}
					</>
				)}
			</div>

			{isAddFriendOpen && (
				<AddFriendBottomSheet
					isOpen={isAddFriendOpen}
					onClose={() => setIsAddFriendOpen(false)}
				/>
			)}

			<ConfirmationModal
				isOpen={Boolean(selectedUserToDelete)}
				direction="rtl"
				isLoading={isRemoving}
				onClose={() => setSelectedUserToDelete(null)}
				onConfirm={() => handleRemoveFriend(selectedUserToDelete?.id || null)}
				message={`"${selectedUserToDelete?.user.name}"، از لیست دوستات حذف بشه؟`}
			/>
		</div>
	)
}
