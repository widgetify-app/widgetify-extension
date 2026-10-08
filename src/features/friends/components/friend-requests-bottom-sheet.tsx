import Analytics from '@/analytics'
import {
	type Friend,
	useHandleFriendRequest,
} from '@/services/friends/friend-service.hook'
import { t } from '@/common/i18n'

import { RemoveFriendButton } from './remove-button'
import { FriendsList } from './friends-list'
import { showToast } from '@/common/toast'
import { Button, Modal } from '@/components/ui'
import { Icon } from '@/icons'

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
			Analytics.event('friends_request_accepted')
			showToast(t('friends.requests.nowFriends'), 'success')
		} catch {
			showToast(t('friends.requests.error'), 'error')
		}
	}

	const rejectFriend = (friendId: string) => {
		Analytics.event('friends_request_declined')
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
						className="gap-1 h-9 px-3 rounded-lg transition-ui active:scale-[0.97]"
						variant="outline"
						color="success"
					>
						<Icon name="userCheck" size={16} />
						<span className="text-xs font-medium">
							{t('friends.requests.accept')}
						</span>
					</Button>
					<RemoveFriendButton
						friend={friend}
						onClick={() => rejectFriend(friend.id)}
						disabled={isProcessing}
						label={t('friends.requests.decline')}
					/>
				</>
			) : (
				<span className="flex items-center px-3 text-xs font-medium rounded-lg h-9 text-fg bg-surface-2">
					{t('friends.requests.sent')}
				</span>
			)}
		</div>
	)

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => onClose()}
			size="lg"
			title={t('friends.requests.title')}
			closeOnBackdropClick
			closeLabel={t('ui.common.close')}
		>
			<FriendsList
				status="PENDING"
				renderFriendActions={renderFriendActions}
				emptyMessage={t('friends.requests.empty')}
				caching={false}
			/>
		</Modal>
	)
}
