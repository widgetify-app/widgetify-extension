import { SectionPanel } from '@/components/section-panel'
import { type Friend, useRemoveFriend } from '@/services/hooks/friends/friendService.hook'
import { translateError } from '@/utils/translate-error'
import { FriendsList } from '../../components/friends-List'
import { RemoveFriendButton } from '../../components/remove-button'
import { showToast } from '@/common/toast'

export const AllFriendsTab = () => {
	const { mutate: removeFriend, isPending: isRemoving } = useRemoveFriend()

	const handleRemoveFriend = (friendId: string) => {
		removeFriend(friendId, {
			onError: (error) => {
				const msg = translateError(error)
				showToast(msg as string, 'error')
			},
		})
	}

	const renderFriendActions = (friend: Friend) => (
		<RemoveFriendButton
			type="REMOVE"
			friend={friend}
			onClick={handleRemoveFriend}
			disabled={isRemoving}
		/>
	)

	return (
		<SectionPanel title="لیست دوستان" size="sm">
			<FriendsList
				status="ACCEPTED"
				renderFriendActions={renderFriendActions}
				emptyMessage="هنوز هیچ دوستی اضافه نکرده‌اید"
			/>
		</SectionPanel>
	)
}
