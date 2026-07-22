import type { ReactNode } from 'react'
import { Button } from '../button/button'
import Modal from '../modal'
import { IconLoading } from '../loading/icon-loading'
import { Icon } from '@/src/icons'

interface ConfirmationModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title?: string
	message?: string | ReactNode
	confirmText?: ReactNode
	cancelText?: string
	variant?: 'danger' | 'warning' | 'info' | 'primary'
	isLoading?: boolean
	icon?: ReactNode
	direction?: 'rtl' | 'ltr'
}

const variantConfig = {
	danger: {
		icon: <Icon name="trash" size={18} />,
		accentBar: 'bg-error',
		iconBg: 'bg-error/10',
		iconColor: 'text-error',
		confirmBg: 'bg-error hover:bg-error/90',
		confirmText: 'text-white',
	},
	warning: {
		icon: <Icon name="alert" size={18} />,
		accentBar: 'bg-warning',
		iconBg: 'bg-warning/10',
		iconColor: 'text-warning',
		confirmBg: 'bg-warning hover:bg-warning/90',
		confirmText: 'text-white',
	},
	info: {
		icon: <Icon name="info" size={18} />,
		accentBar: 'bg-info',
		iconBg: 'bg-info/10',
		iconColor: 'text-info',
		confirmBg: 'bg-info/80 hover:bg-info/90',
		confirmText: 'text-white',
	},
	primary: {
		icon: <Icon name="info" size={18} />,
		accentBar: 'bg-primary',
		iconBg: 'bg-primary/10',
		iconColor: 'text-primary',
		confirmBg: 'bg-primary/80 hover:bg-primary/90',
		confirmText: 'text-white',
	},
}

export function ConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title = 'تایید عملیات',
	message = 'آیا از انجام این عملیات اطمینان دارید؟',
	confirmText = 'تایید',
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
			title={
				<div className="flex items-center gap-3">
					<div
						className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
					>
						<div className={config.iconColor}>{displayIcon}</div>
					</div>
					{title && (
						<h3 className="text-base font-semibold text-content">{title}</h3>
					)}
				</div>
			}
		>
			<div className="relative overflow-hidden">
				<div className="pt-1 text-sm leading-relaxed text-muted">
					{typeof message === 'string' ? <p>{message}</p> : message}
				</div>

				<div className="mt-4 border-t border-base-content/10" />

				<div className="flex items-center justify-end gap-2 pt-3">
					<Button
						onClick={handleCancel}
						size="md"
						disabled={isLoading}
						className="bg-transparent border-none text-muted hover:text-content hover:bg-base-300/40 rounded-2xl"
					>
						{cancelText}
					</Button>
					<Button
						onClick={handleConfirm}
						size="md"
						disabled={isLoading}
						loading={isLoading}
						loadingText={
							<div className="flex items-center gap-1">
								<IconLoading className="mx-0! text-white!" />
								<span className="text-xs">در حال انجام...</span>
							</div>
						}
						className={`${config.confirmBg} ${config.confirmText} w-fit px-8 border-none rounded-2xl`}
					>
						{confirmText}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
