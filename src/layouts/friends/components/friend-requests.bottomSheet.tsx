import {
	type Friend,
	useHandleFriendRequest,
} from '@/services/hooks/friends/friendService.hook'

import { RemoveFriendButton } from './remove-button'
import { FriendsList } from './friends-List'
import { Button } from '@/components/button/button'
import { showToast } from '@/common/toast'
import Modal from '@/components/modal'
import { Icon } from '@/src/icons'

interface Prop {
	isOpen: boolean
	onClose: () => void
}
export const FriendRequestsBottomSheet = ({ isOpen, onClose }: Prop) => {
	const { mutateAsync: handleFriendAction, isPending: isProcessing } =
		useHandleFriendRequest()

	const acceptFriend = async (friendId: string) => {
		try {
			await handleFriendAction({
				friendId,
				state: 'accepted',
			})
			showToast('دوست شدید!', 'success', { alarmSound: true })
		} catch {
			showToast('خطا در پردازش', 'error')
		}
	}

	const rejectFriend = (friendId: string) => {
		handleFriendAction({
			friendId,
			state: 'rejected',
		})
	}

	const renderFriendActions = (friend: Friend) => (
		<div className="flex space-x-2">
			{!friend.sendByMe ? (
				<>
					<Button
						type="button"
						size="sm"
						onClick={() => acceptFriend(friend.id)}
						disabled={isProcessing}
						className="flex items-center justify-center gap-1
				h-9 px-3
				text-success bg-success/10 border border-success/20
				rounded-lg transition-all
				active:scale-[0.97]"
					>
						<Icon name="userCheck" size={18} />
						<span className="text-xs font-medium">دوست شیم</span>
					</Button>
					<RemoveFriendButton
						friend={friend}
						onClick={() => rejectFriend(friend.id)}
						disabled={isProcessing}
						label="رد کردن"
					/>
				</>
			) : (
				<span className="flex items-center px-3 text-xs font-medium rounded-lg h-9 text-content bg-content">
					ارسال شده
				</span>
			)}
		</div>
	)

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => onClose()}
			size="lg"
			title="درخواست های دوستی"
			closeOnBackdropClick
			direction="rtl"
		>
			<FriendsList
				status="PENDING"
				renderFriendActions={renderFriendActions}
				emptyMessage="درخواست دوستی جدیدی ندارید"
				caching={false}
			/>
		</Modal>
	)
}
