import { useState } from 'react'
import { Button } from '@/components/button/button'
import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { useSendFriendRequest } from '@/services/hooks/friends/friendService.hook'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'
import { FiUserPlus, FiAlertCircle } from 'react-icons/fi'
import Modal from '@/components/modal'

interface AddFriendBottomSheetProps {
	isOpen: boolean
	onClose: () => void
}

export function AddFriendBottomSheet({ isOpen, onClose }: AddFriendBottomSheetProps) {
	const { user } = useAuth()
	const [username, setUsername] = useState('')
	const [translatedError, setTranslatedError] = useState<string | null>(null)
	const { mutate: sendFriendRequest, isPending: isSending } = useSendFriendRequest()

	const handleSendRequest = () => {
		if (!user?.username) {
			showToast(
				'برای ارسال درخواست دوستی، ابتدا باید نام کاربری خود را در بخش پروفایل تنظیم کنید.',
				'error'
			)
			return
		}
		if (!username.trim()) return

		setTranslatedError(null)

		sendFriendRequest(
			{ username },
			{
				onSuccess: () => {
					setUsername('')
					showToast('درخواست دوستی با موفقیت ارسال شد', 'success')
					setTranslatedError(null)
					// Close the bottom sheet after successful request
					setTimeout(() => {
						onClose()
					}, 500)
				},
				onError: (err) => {
					const message = translateError(err)
					if (typeof message === 'string') {
						showToast(message, 'error')
					} else {
						setTranslatedError(message.username)
					}
				},
			}
		)
	}

	const handleUsernameChange = (value: string) => {
		setUsername(value)
		if (translatedError) {
			setTranslatedError(null)
		}
	}

	const handleClose = () => {
		setUsername('')
		setTranslatedError(null)
		onClose()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="lg"
			title="افزودن دوست جدید"
			direction="rtl"
		>
			<div className="flex flex-col gap-3 p-5">
				<div className="flex items-center justify-center">
					<div className="relative mb-2">
						<div className="flex items-center justify-center w-16 h-16 rounded-xl bg-content">
							<FiUserPlus className="text-content" size={26} />
						</div>
						<div className="absolute inset-0 rounded-full bg-content blur-xl opacity-40" />
					</div>
				</div>

				<div className="text-center">
					<p className="text-sm leading-relaxed text-base-content/70">
						برای افزودن دوست جدید، نام کاربری او را وارد کنید
					</p>
				</div>

				{!user?.username && (
					<div className="flex items-start gap-3 p-4 border rounded-xl bg-yellow-500/10 border-yellow-500/20">
						<FiAlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
						<p className="text-sm leading-relaxed text-warning">
							برای ارسال درخواست دوستی، ابتدا باید نام کاربری خود را در بخش
							پروفایل تنظیم کنید.
						</p>
					</div>
				)}

				<div className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="friend-username"
							className="block text-sm font-medium text-base-content"
						>
							نام کاربری
						</label>

						<TextInput
							id="friend-username"
							name="friend-username"
							type="text"
							value={username}
							onChange={handleUsernameChange}
							placeholder="مثال: john_doe"
							className="w-full"
							aria-label="نام کاربری دوست"
							disabled={!user?.username}
						/>

						{translatedError && (
							<p className="flex items-center gap-1 text-sm text-red-500">
								<FiAlertCircle className="w-4 h-4" />
								{translatedError}
							</p>
						)}
					</div>

					<Button
						type="button"
						onClick={handleSendRequest}
						disabled={!username || isSending}
						size="lg"
						rounded="xl"
						className={`w-full h-12 bg-success text-success-content shadow-sm shadow-success/20  border-none`}
					>
						ارسال درخواست
					</Button>
				</div>
			</div>
		</Modal>
	)
}
