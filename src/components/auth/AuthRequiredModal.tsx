import { callEvent } from '@/common/utils/call-event'
import Modal from '@/components/modal'
import { Button } from '../button/button'
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
	message = 'برای دسترسی به این بخش یا انجام این عملیات، ابتدا وارد حساب کاربری خود شوید.',
	loginButtonText = 'ورود به حساب',
	cancelButtonText = 'بعداً',
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
			title={'نیاز ورود به حساب کاربری'}
			closeOnBackdropClick={true}
		>
			<div className="flex flex-col items-center justify-between w-full text-center h-62">
				<div className="relative flex items-center justify-center w-16 h-16 mt-8 rounded-full bg-blue-500/10">
					<div
						className="absolute inset-0 rounded-full bg-primary/5 animate-ping"
						style={{ animationDuration: '2s' }}
					/>
					<Icon
						name="lock"
						className="relative text-2xl md:text-3xl text-primary"
					/>
				</div>
				{title && <h3 className="text-lg font-semibold text-content">{title}</h3>}
				<p className={'text-muted text-xs font-medium'}>{message}</p>

				<div className="flex w-full gap-2 mt-1">
					<Button
						onClick={triggerAccountTabDisplay}
						size="md"
						isPrimary={true}
						className={`flex-1 border-none rounded-2xl text-xs w-full`}
					>
						{loginButtonText}
					</Button>
					<Button
						onClick={onClose}
						size="md"
						className="w-32 border border-content text-content hover:bg-base-300/50 rounded-2xl"
					>
						{cancelButtonText}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
