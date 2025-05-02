import { SectionPanel } from '@/components/section-panel'
import { FriendsList } from '@/layouts/navbar/friends-list/setting/components/friends-List'
import {
	type Friend,
	useRemoveFriend,
} from '@/services/getMethodHooks/friends/friendService.hook'
import { translateError } from '@/utils/translate-error'
import toast from 'react-hot-toast'
import { RemoveFriendButton } from '../components/remove-button'

export const AllFriendsTab = () => {
	const { mutate: removeFriend, isPending: isRemoving } = useRemoveFriend()

	const handleRemoveFriend = (friendId: string) => {
		removeFriend(friendId, {
			onError: (error) => {
				const msg = translateError(error)
				toast.error(msg as string, {
					style: {
						backgroundColor: '#f8d7da',
						color: '#721c24',
					},
				})
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
