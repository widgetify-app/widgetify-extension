import { useState } from 'react'
import { type Friend, useRemoveFriend } from '@/services/friends/friend-service.hook'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { RemoveFriendButton } from './components/remove-button'
import { FriendsList } from './components/friends-list'
import { ConfirmationModal } from '@/components/ui'

export { FriendsActions } from './components/friends-actions'
export { FriendsDirectView } from './components/friends-direct-view'
export { SelectFriendLayout } from './components/select-friend'

export const FriendsLayout = () => {
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
			<FriendsList
				status="ACCEPTED"
				renderFriendActions={renderFriendActions}
				itemsPerPage={8}
				emptyMessage="هنوز دوستی اضافه نکردی"
				caching={true}
				className="px-0 pb-0 mt-0"
			/>

			<ConfirmationModal
				isOpen={!!selectedUser}
				isLoading={isRemoving}
				onClose={() => setSelectedUser(null)}
				onConfirm={() => handleRemoveFriend(selectedUser?.id || null)}
				message={`"${selectedUser?.user.name}" از لیست دوستات حذف بشه؟`}
			/>
		</>
	)
}
