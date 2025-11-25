import type { ReactNode } from 'react'
import { FiAlertTriangle, FiCheck, FiTrash2 } from 'react-icons/fi'
import { Button } from '../button/button'
import Modal from '../modal'
import { IconLoading } from '../loading/icon-loading'

interface ConfirmationModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title?: string
	message?: string | ReactNode
	confirmText?: ReactNode
	cancelText?: string
	variant?: 'danger' | 'warning' | 'info'
	isLoading?: boolean
	icon?: ReactNode
	direction?: 'rtl' | 'ltr'
}

const variantConfig = {
	danger: {
		icon: <FiTrash2 size={24} />,
		iconBg: 'bg-error/10',
		iconColor: 'text-error',
		confirmBg: 'bg-error hover:bg-error/90',
		confirmText: 'text-white',
	},
	warning: {
		icon: <FiAlertTriangle size={24} />,
		iconBg: 'bg-warning/10',
		iconColor: 'text-warning',
		confirmBg: 'bg-warning hover:bg-warning/90',
		confirmText: 'text-white',
	},
	info: {
		icon: <FiCheck size={24} />,
		iconBg: 'bg-info/10',
		iconColor: 'text-info',
		confirmBg: 'bg-info/80 hover:bg-info/90',
		confirmText: 'text-white',
	},
}

export function ConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title = 'تأیید عملیات',
	message = 'آیا از انجام این عملیات اطمینان دارید؟',
	confirmText = 'تأیید',
	cancelText = 'انصراف',
	variant = 'danger',
	isLoading = false,
	icon,
	direction = 'rtl',
}: ConfirmationModalProps) {
	const config = variantConfig[variant]
	const displayIcon = icon || config.icon

	const handleConfirm = () => {
		if (!isLoading) {
			onConfirm()
		}
	}

	const handleCancel = () => {
		if (!isLoading) {
			onClose()
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleCancel}
			size="sm"
			direction={direction}
			closeOnBackdropClick={!isLoading}
			showCloseButton={!isLoading}
			title={' '}
		>
			<div className="space-y-2 text-center">
				<div className="flex justify-center">
					<div
						className={`w-16 h-16 rounded-full flex items-center justify-center ${config.iconBg}`}
					>
						<div className={config.iconColor}>{displayIcon}</div>
					</div>
				</div>

				{title && <h3 className="text-lg font-semibold text-content">{title}</h3>}

				<div className="text-sm leading-relaxed text-muted">
					{typeof message === 'string' ? <p>{message}</p> : message}
				</div>

				<div className="flex gap-3 pt-2">
					<Button
						onClick={handleConfirm}
						size="md"
						disabled={isLoading}
						loading={isLoading}
						loadingText={
							<div className="flex items-center gap-1">
								<IconLoading className="!mx-0 !text-white" />
								<span className="text-xs">در حال انجام...</span>
							</div>
						}
						className={`flex-1 ${config.confirmBg} ${config.confirmText} border-none rounded-2xl`}
					>
						{confirmText}
					</Button>
					<Button
						onClick={handleCancel}
						size="md"
						disabled={isLoading}
						className="flex-1 border border-content/20 text-content hover:bg-base-300/50 rounded-2xl"
					>
						{cancelText}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
