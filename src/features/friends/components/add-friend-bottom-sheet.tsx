import { useState } from 'react'
import Analytics from '@/analytics'
import { TextInput } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useSendFriendRequest } from '@/services/friends/friend-service.hook'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { Alert, Button, EmptyArt, Modal } from '@/components/ui'
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
	const copyOwnUsername = async () => {
		if (!user?.username) return

		try {
			await navigator.clipboard.writeText(user.username)
			showToast(t('friends.add.copied'), 'success')
		} catch {
			showToast(t('friends.add.copyFailed'), 'error')
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="sm"
			title={t('friends.add.title')}
			closeLabel={t('ui.common.close')}
		>
			<form
				className="flex flex-col gap-4 px-1 pb-1"
				onSubmit={(event) => {
					event.preventDefault()
					handleSendRequest()
				}}
			>
				<div className="flex flex-col items-center gap-2 pt-1 text-center">
					<EmptyArt name="users" className="size-16" />
					<p className="text-sm font-semibold text-fg-strong">
						{t('friends.add.prompt')}
					</p>
					<p className="text-xs leading-relaxed text-fg-muted">
						{t('friends.add.hint')}
					</p>
				</div>

				{!canSendRequest && (
					<Alert tone="warning">{t('friends.add.setUsernameFirstLong')}</Alert>
				)}

				<div className="space-y-1.5">
					<label
						htmlFor="friend-username"
						className="block text-xs font-medium text-fg-muted"
					>
						{t('friends.add.usernameLabel')}
					</label>

					<div dir="ltr" className="relative">
						<span
							aria-hidden="true"
							className="absolute text-sm -translate-y-1/2 pointer-events-none left-3 top-1/2 text-fg-faint"
						>
							@
						</span>
						<TextInput
							id="friend-username"
							name="friend-username"
							type="text"
							direction="ltr"
							value={username}
							onChange={handleUsernameChange}
							placeholder="john_doe"
							className="w-full ps-7"
							aria-label={t('friends.add.friendUsername')}
							invalid={Boolean(translatedError)}
							autoComplete="off"
							disabled={!canSendRequest}
						/>
					</div>

					{translatedError && (
						<p className="flex items-center gap-1 text-xs text-danger">
							<Icon name="alert" size={12} />
							{translatedError}
						</p>
					)}
				</div>

				<Button
					type="submit"
					disabled={!canSendRequest || !username.trim()}
					loading={isSending}
					size="md"
					rounded="xl"
					color="brand"
					fullWidth
					icon={<Icon name="usersPlus" size={16} />}
				>
					{t('friends.add.send')}
				</Button>

				{user?.username && (
					<div className="flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl bg-fill">
						<span className="min-w-0 text-fg-muted">
							{t('friends.add.yourUsername')}{' '}
							<span dir="ltr" className="font-semibold text-fg-strong">
								@{user.username}
							</span>
						</span>
						<Button
							type="button"
							size="xs"
							rounded="lg"
							variant="ghost"
							icon={<Icon name="copy" size={12} />}
							onClick={copyOwnUsername}
						>
							{t('friends.add.copy')}
						</Button>
					</div>
				)}
			</form>
		</Modal>
	)
}
