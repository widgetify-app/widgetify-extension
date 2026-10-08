import { callEvent } from '@/common/utils/call-event'
import { t } from '@/common/i18n'
import { Modal } from '@/components/ui'
import { Button } from '@/components/ui'
import { Icon } from '@/icons'

interface AuthRequiredModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	message?: string
	loginButtonText?: string
	cancelButtonText?: string
}

export function AuthRequiredModal({
	isOpen,
	onClose,
	title,
	message,
	loginButtonText,
	cancelButtonText,
}: AuthRequiredModalProps) {
	const resolvedTitle = title ?? t('auth.required.title')
	const resolvedMessage = message ?? t('auth.required.message')
	const resolvedLogin = loginButtonText ?? t('auth.required.login')
	const resolvedCancel = cancelButtonText ?? t('auth.required.cancel')

	function triggerAccountTabDisplay() {
		onClose()
		callEvent('openProfile')
	}

	return (
		<Modal
			size="sm"
			isOpen={isOpen}
			onClose={onClose}
			closeOnBackdropClick={true}
			showCloseButton={true}
			closeLabel={t('ui.common.close')}
		>
			<div className="flex flex-col items-center justify-between w-full h-56 pt-2 text-center">
				<div className="relative flex items-center justify-center w-16 h-16 border shadow-sm rounded-2xl bg-surface-2 border-surface-3">
					<Icon name="lock" className="relative text-2xl text-brand" />
				</div>

				<div className="flex flex-col items-center gap-1.5 px-2">
					<h3 className="text-base font-semibold text-fg">{resolvedTitle}</h3>
					<p className="text-xs leading-relaxed text-fg-muted max-w-70">
						{resolvedMessage}
					</p>
				</div>

				<div className="flex w-full gap-2 mt-2">
					<Button
						onClick={triggerAccountTabDisplay}
						size="md"
						color="brand"
						className="flex-1 text-xs"
						rounded={'2xl'}
					>
						{resolvedLogin}
					</Button>
					<Button
						onClick={onClose}
						size="md"
						variant="outline"
						className="text-xs w-28"
						rounded={'2xl'}
					>
						{resolvedCancel}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
