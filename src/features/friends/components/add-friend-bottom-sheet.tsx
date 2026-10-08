import { useState } from 'react'
import Analytics from '@/analytics'
import { TextInput } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useSendFriendRequest } from '@/services/friends/friend-service.hook'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { Alert, Button, Modal } from '@/components/ui'
import { Icon } from '@/icons'
import { t } from '@/common/i18n'

interface AddFriendBottomSheetProps {
	isOpen: boolean
	onClose: () => void
}

export function AddFriendBottomSheet({ isOpen, onClose }: AddFriendBottomSheetProps) {
	const { user } = useAuth()
	const [username, setUsername] = useState('')
	const [translatedError, setTranslatedError] = useState<string | null>(null)
	const { mutate: sendFriendRequest, isPending: isSending } = useSendFriendRequest()
	const canSendRequest = !!user?.username

	const handleSendRequest = () => {
		if (!canSendRequest) {
			showToast(t('friends.add.setUsernameFirst'), 'error')
			return
		}
		if (!username.trim()) return

		setTranslatedError(null)

		sendFriendRequest(
			{ username },
			{
				onSuccess: () => {
					Analytics.event('friends_request_sent')
					setUsername('')
					showToast(t('friends.add.sent'), 'success')
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
			title={t('friends.add.title')}
			closeLabel={t('ui.common.close')}
		>
			<div className="flex flex-col gap-3 p-5">
				<div className="flex items-center justify-center">
					<div className="relative mb-2">
						<div className="flex items-center justify-center w-16 h-16 rounded-xl bg-surface-2">
							<Icon name="usersPlus" className="text-fg" size={24} />
						</div>
						<div className="absolute inset-0 rounded-full bg-surface-2 blur-xl opacity-40" />
					</div>
				</div>

				<div className="text-center">
					<p className="text-sm leading-relaxed text-fg-muted">
						{t('friends.add.prompt')}
					</p>
				</div>

				{!canSendRequest && (
					<Alert tone="warning">{t('friends.add.setUsernameFirstLong')}</Alert>
				)}

				<div className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="friend-username"
							className="block text-sm font-medium text-fg-strong"
						>
							{t('friends.add.usernameLabel')}
						</label>

						<TextInput
							id="friend-username"
							name="friend-username"
							type="text"
							value={username}
							onChange={handleUsernameChange}
							placeholder={t('friends.add.usernameExample')}
							className="w-full"
							aria-label={t('friends.add.friendUsername')}
							disabled={!user?.username}
						/>

						{translatedError && (
							<p className="flex items-center gap-1 text-sm text-danger">
								<Icon name="alert" className="w-4 h-4" />
								{translatedError}
							</p>
						)}
					</div>

					<Button
						type="button"
						onClick={handleSendRequest}
						disabled={!canSendRequest || isSending || !username}
						size="lg"
						rounded="xl"
						color="success"
						fullWidth
						className="h-12 shadow-sm shadow-success-fill-2"
					>
						{t('friends.add.send')}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
