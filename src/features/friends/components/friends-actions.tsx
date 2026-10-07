import { useState } from 'react'
import { Button } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { AddFriendBottomSheet } from './add-friend-bottom-sheet'
import { FriendRequestsButton } from './friend-requests-button'

export function FriendsActions() {
	const { user } = useAuth()
	const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

	return (
		<>
			<FriendRequestsButton
				size="large"
				pendingCount={user?.friendshipStats?.pending}
			/>

			<Button
				onClick={() => setIsAddFriendOpen(true)}
				type="button"
				variant={'solid'}
				color={'brand'}
				size={'sm'}
			>
				<Icon name="usersPlus" className="w-4 h-4" />
				<span className="text-sm font-medium">افزودن دوست</span>
			</Button>

			{isAddFriendOpen && (
				<AddFriendBottomSheet isOpen onClose={() => setIsAddFriendOpen(false)} />
			)}
		</>
	)
}
