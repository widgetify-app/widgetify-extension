import { useState } from 'react'
import { useDelayedUnmount, useLastDefined } from '@/hooks/use-delayed-unmount'
import { MODAL_EXIT_MS } from '@/components/ui'
import { type Friend, useRemoveFriend } from '@/services/hooks/friends/friend-service.hook'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { RemoveFriendButton } from './components/remove-button'
import { FriendsList } from './components/friends-list'
import { AddFriendBottomSheet } from './components/add-friend.bottom-sheet'
import { ConfirmationModal } from '@/components/ui'
import { FriendRequestsButton } from './components/buttons/friend-requests.button'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/src/icons'

export const FriendsLayout = () => {
	const { user } = useAuth()
	const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

	const [selectedUser, setSelectedUser] = useState<Friend | null>()
	const lastSelectedUser = useLastDefined(selectedUser)
	const shouldMountAddFriend = useDelayedUnmount(isAddFriendOpen, MODAL_EXIT_MS)

	const { mutate: removeFriend, isPending: isRemoving } = useRemoveFriend()

	const handleRemoveFriend = (friendId: string | null) => {
		if (!friendId) return

		removeFriend(friendId, {
			onError: (error) => {
				const msg = translateError(error)
				showToast(msg as string, 'error')
			},
			onSuccess: () => {
				setSelectedUser(null)
			},
		})
	}

	const renderFriendActions = (friend: Friend) => (
		<RemoveFriendButton
			friend={friend}
			onClick={() => setSelectedUser(friend)}
			disabled={isRemoving}
		/>
	)

	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between px-4">
					<div className="flex items-center gap-2">
						<h2 className="text-lg font-semibold text-content">دوستان</h2>
					</div>

					<div className="flex items-center gap-2">
						<FriendRequestsButton
							size="large"
							pendingCount={user?.friendshipStats?.pending}
						/>

						<button
							onClick={() => setIsAddFriendOpen(true)}
							className="flex items-center gap-2 px-3 py-1.5 transition-all border shadow-sm cursor-pointer rounded-xl bg-primary border-primary/90 text-white/80 border-content active:scale-95"
							aria-label="افزودن دوست جدید"
							type="button"
						>
							<Icon name="usersPlus" className="w-4 h-4" />
							<span className="hidden text-sm font-medium sm:inline">
								افزودن دوست
							</span>
						</button>
					</div>
				</div>

				<div className="h-[calc(90vh-15rem)]">
					<FriendsList
						status="ACCEPTED"
						renderFriendActions={renderFriendActions}
						itemsPerPage={8}
						emptyMessage="هنوز هیچ دوستی اضافه نکرده‌اید"
						caching={true}
					/>
				</div>
			</div>

			{shouldMountAddFriend && (
				<AddFriendBottomSheet
					isOpen={isAddFriendOpen}
					onClose={() => setIsAddFriendOpen(false)}
				/>
			)}

			<ConfirmationModal
				isOpen={!!selectedUser}
				direction="rtl"
				isLoading={isRemoving}
				onClose={() => setSelectedUser(null)}
				onConfirm={() => handleRemoveFriend(lastSelectedUser?.id || null)}
				message={`"${lastSelectedUser?.user.name}"، حذف بشه از لیست دوستات؟`}
			/>
		</>
	)
}
