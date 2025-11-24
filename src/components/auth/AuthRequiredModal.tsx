import { IoIosLogIn } from 'react-icons/io'
import { callEvent } from '@/common/utils/call-event'
import Modal from '@/components/modal'
import { Button } from '../button/button'

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
	title = '🔐 ورود به حساب کاربری',
	message = 'برای دسترسی به این بخش یا انجام این عملیات، ابتدا وارد حساب کاربری خود شوید.',
	loginButtonText = 'ورود به حساب',
	cancelButtonText = 'بعداً',
}: AuthRequiredModalProps) {
	function triggerAccountTabDisplay() {
		onClose()
		callEvent('openProfile')
	}

	return (
		<Modal size="sm" isOpen={isOpen} onClose={onClose} direction="rtl" title={title}>
			<div className="flex flex-col items-center justify-between w-full h-56 text-center">
				<div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10">
					<IoIosLogIn size={24} className="text-blue-500" />
				</div>

				<p className={'text-content text-sm'}>{message}</p>

				<div className="flex w-full gap-2">
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
						className="w-32 border border-content/20 text-content hover:bg-base-300/50 rounded-2xl"
					>
						{cancelButtonText}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
