import { SectionPanel } from '@/components/section-panel'
import Tooltip from '@/components/toolTip'
import { FriendsList } from '@/layouts/navbar/friends-list/setting/components/friends-List'
import {
	type Friend,
	useRemoveFriend,
} from '@/services/getMethodHooks/friends/friendService.hook'
import { FiUserX } from 'react-icons/fi'

export const AllFriendsTab = () => {
	const { mutate: removeFriend, isPending: isRemoving } = useRemoveFriend()

	const handleRemoveFriend = (friendId: string) => {
		removeFriend(friendId)
	}

	const renderFriendActions = (friend: Friend) => (
		<Tooltip content="حذف دوست">
			<button
				onClick={() => handleRemoveFriend(friend.id)}
				disabled={isRemoving}
				className="p-2 text-red-500 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
			>
				<FiUserX size={18} />
			</button>
		</Tooltip>
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
