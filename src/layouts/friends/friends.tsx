import { useState } from 'react'
import { type Friend, useRemoveFriend } from '@/services/hooks/friends/friendService.hook'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'
import { RemoveFriendButton } from './components/remove-button'
import { FriendsList } from './components/friends-List'
import { FiUserPlus } from 'react-icons/fi'
import { AddFriendBottomSheet } from './components/add-friend.bottomSheet'
import { ConfirmationModal } from '@/components/modal/confirmation-modal'
import { FriendRequestsButton } from './components/buttons/friend-requests.button'
import { useAuth } from '@/context/auth.context'

export const FriendsLayout = () => {
	const { user } = useAuth()
	const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

	const [selectedUser, setSelectedUser] = useState<Friend | null>()

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
							<FiUserPlus className="w-4 h-4" />
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

			{isAddFriendOpen && (
				<AddFriendBottomSheet isOpen onClose={() => setIsAddFriendOpen(false)} />
			)}

			{selectedUser && (
				<ConfirmationModal
					isOpen
					direction="rtl"
					isLoading={isRemoving}
					onClose={() => setSelectedUser(null)}
					onConfirm={() => handleRemoveFriend(selectedUser?.id || null)}
					message={`"${selectedUser?.user.name}"، حذف بشه از لیست دوستات؟`}
				/>
			)}
		</>
	)
}
