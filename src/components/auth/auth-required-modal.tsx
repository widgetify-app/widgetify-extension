import { callEvent } from '@/common/utils/call-event'
import { Modal } from '@/components/ui'
import { Button } from '@/components/ui'
import { Icon } from '@/src/icons'

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
	title = 'ورود به حساب کاربری',
	message = 'برای دسترسی به این بخش اول وارد حسابت شو',
	loginButtonText = 'ورود به حساب',
	cancelButtonText = 'فعلا نه',
}: AuthRequiredModalProps) {
	function triggerAccountTabDisplay() {
		onClose()
		callEvent('openProfile')
	}

	return (
		<Modal
			size="sm"
			isOpen={isOpen}
			onClose={onClose}
			direction="rtl"
			closeOnBackdropClick={true}
			showCloseButton={true}
			title=" "
		>
			<div className="flex flex-col items-center justify-between w-full h-56 pt-2 text-center">
				<div className="relative flex items-center justify-center w-16 h-16 border shadow-xs rounded-2xl bg-base-200 border-base-300/60">
					<Icon name="lock" className="relative text-2xl text-primary" />
				</div>

				<div className="flex flex-col items-center gap-1.5 px-2">
					<h3 className="text-base font-semibold text-content">{title}</h3>
					<p className="text-xs leading-relaxed text-muted max-w-70">
						{message}
					</p>
				</div>

				<div className="flex w-full gap-2 mt-2">
					<Button
						onClick={triggerAccountTabDisplay}
						size="md"
						variant="primary"
						className="flex-1 text-xs"
						rounded={'2xl'}
					>
						{loginButtonText}
					</Button>
					<Button
						onClick={onClose}
						size="md"
						variant="outline"
						className="text-xs w-28"
						rounded={'2xl'}
					>
						{cancelButtonText}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
