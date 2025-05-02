import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import { getButtonStyles, getTextColor, useTheme } from '@/context/theme.context'
import { FriendsList } from '@/layouts/navbar/friends-list/setting/components/friends-List'
import {
	type Friend,
	useHandleFriendRequest,
	useSendFriendRequest,
} from '@/services/getMethodHooks/friends/friendService.hook'
import { translateError } from '@/utils/translate-error'
import { useState } from 'react'
import { FiUserCheck, FiUserX } from 'react-icons/fi'

export const FriendRequestsTab = () => {
	const { theme } = useTheme()
	const [username, setUsername] = useState('')
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [translatedError, setTranslatedError] = useState<string | null>(null)
	const { mutate: sendFriendRequest, isPending: isSending } = useSendFriendRequest()

	const { mutate: handleFriendAction, isPending: isProcessing } = useHandleFriendRequest()

	const handleSendRequest = () => {
		if (!username.trim()) return

		setSuccessMessage(null)
		setTranslatedError(null)

		sendFriendRequest(
			{ username },
			{
				onSuccess: () => {
					setUsername('')
					setSuccessMessage('درخواست دوستی با موفقیت ارسال شد')
					setTranslatedError(null)
				},
				onError: (err) => {
					const message = translateError(err)
					setTranslatedError(typeof message === 'string' ? message : 'خطای ناشناخته')
				},
			},
		)
	}

	const handleUsernameChange = (value: string) => {
		setUsername(value)
		if (translatedError || successMessage) {
			setSuccessMessage(null)
			setTranslatedError(null)
		}
	}

	const acceptFriend = (friendId: string) => {
		handleFriendAction({
			friendId,
			state: 'accepted',
		})
	}

	const rejectFriend = (friendId: string) => {
		handleFriendAction({
			friendId,
			state: 'rejected',
		})
	}

	const renderFriendActions = (friend: Friend) => (
		<div className="flex space-x-2">
			<button
				onClick={() => acceptFriend(friend.id)}
				disabled={isProcessing}
				className="p-2 text-green-500 rounded-lg cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20"
			>
				<FiUserCheck size={18} />
			</button>
			<button
				onClick={() => rejectFriend(friend.id)}
				disabled={isProcessing}
				className="p-2 mr-2 text-red-500 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
			>
				<FiUserX size={18} />
			</button>
		</div>
	)

	return (
		<div className="space-y-6">
			<SectionPanel title="درخواست دوستی جدید" size="sm">
				<div className="space-y-2">
					<label className={`block text-sm font-medium ${getTextColor(theme)}`}>
						نام کاربری
					</label>
					<div className="flex">
						<TextInput
							type="text"
							value={username}
							onChange={handleUsernameChange}
							placeholder="نام کاربری دوست خود را وارد کنید"
							className="w-full"
						/>
						<button
							onClick={handleSendRequest}
							disabled={isSending || !username.trim()}
							className={`${getButtonStyles(theme, true)} cursor-pointer mr-2 px-4 py-2 rounded-lg whitespace-nowrap`}
						>
							{isSending ? 'در حال ارسال...' : 'ارسال درخواست'}
						</button>
					</div>
					{translatedError && <p className="text-sm text-red-500">{translatedError}</p>}
					{successMessage && <p className="text-sm text-green-500">{successMessage}</p>}
				</div>
			</SectionPanel>

			<SectionPanel title="درخواست‌های دوستی" size="sm">
				<FriendsList
					status="PENDING"
					renderFriendActions={renderFriendActions}
					emptyMessage="درخواست دوستی جدیدی ندارید"
				/>
			</SectionPanel>
		</div>
	)
}
