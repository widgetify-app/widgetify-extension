import type { ReactNode } from 'react'
import { Button } from '../button/button'
import { Modal } from './modal'
import { IconLoading } from '../loading/loading'
import { Icon } from '@/icons'
import { cn } from '@/common/utils/cn'
import { confirmationIconVariants } from './confirmation-modal.variants'

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

const confirmButtonColor = {
	danger: 'danger',
	warning: 'warning',
	info: 'info',
	primary: 'primary',
} as const

const variantIcon = {
	danger: <Icon name="trash" size={18} />,
	warning: <Icon name="alert" size={18} />,
	info: <Icon name="info" size={18} />,
	primary: <Icon name="info" size={18} />,
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
	const displayIcon = icon || variantIcon[variant]

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
						className={cn(
							confirmationIconVariants({ variant }),
							'h-10 w-10 shrink-0 rounded-xl'
						)}
					>
						<div>{displayIcon}</div>
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

				<div className="mt-4 border-t border-subtle" />

				<div className="flex items-center justify-end gap-2 pt-3">
					<Button
						onClick={handleCancel}
						size="md"
						disabled={isLoading}
						variant="ghost"
						rounded="2xl"
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
								<IconLoading className="mx-0! text-current!" />
								<span className="text-xs">در حال انجام...</span>
							</div>
						}
						color={confirmButtonColor[variant]}
						rounded="2xl"
						className="w-fit px-8"
					>
						{confirmText}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
