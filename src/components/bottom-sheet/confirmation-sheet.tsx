import type { ReactNode } from 'react'

import { FiAlertTriangle, FiCheck, FiInfo, FiTrash2 } from 'react-icons/fi'

import { BottomSheet } from '../bottom-sheet/bottom-sheet'
import { Button } from '../button/button'

interface ConfirmationSheetProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void | Promise<void>
	title?: string
	message?: string | ReactNode
	confirmText?: ReactNode
	cancelText?: string
	variant?: 'danger' | 'warning' | 'info' | 'success'
	isLoading?: boolean
	icon?: ReactNode
	loadingText?: string
	disableCancelWhileLoading?: boolean
	autoCloseOnConfirm?: boolean
}

const variantConfig = {
	danger: {
		icon: <FiTrash2 size={20} />,
		iconBg: 'bg-error/10',
		iconColor: 'text-error',
		confirmBg: 'bg-error hover:bg-error/90 shadow-sm shadow-error/20',
	},
	warning: {
		icon: <FiAlertTriangle size={20} />,
		iconBg: 'bg-warning/10',
		iconColor: 'text-warning',
		confirmBg: 'bg-warning hover:bg-warning/90 shadow-sm shadow-warning/20',
	},
	info: {
		icon: <FiInfo size={20} />,
		iconBg: 'bg-info/10',
		iconColor: 'text-info',
		confirmBg: 'bg-info hover:bg-info/90 shadow-sm shadow-info/20',
	},
	success: {
		icon: <FiCheck size={20} />,
		iconBg: 'bg-success/10',
		iconColor: 'text-success',
		confirmBg: 'bg-success hover:bg-success/90 shadow-sm shadow-success/20',
	},
} as const

export function ConfirmationSheet({
	isOpen,
	onClose,
	onConfirm,
	title = 'تاییدیه',
	message = 'آیا از انجام این عملیات اطمینان دارید؟',
	confirmText = 'تأیید',
	cancelText = 'انصراف',
	variant = 'danger',
	isLoading = false,
	icon,
	loadingText = 'در حال پردازش...',
	disableCancelWhileLoading = true,
	autoCloseOnConfirm = false,
}: ConfirmationSheetProps) {
	const config = variantConfig[variant]

	const handleConfirm = async () => {
		if (isLoading) return
		try {
			await onConfirm()
			if (autoCloseOnConfirm) onClose()
		} catch (error) {
			console.error('Confirmation error:', error)
		}
	}

	const handleCancel = () => {
		if (isLoading && disableCancelWhileLoading) return
		onClose()
	}

	return (
		<BottomSheet
			isOpen={isOpen}
			onClose={handleCancel}
			size="medium"
			closeOnBackdrop={!isLoading}
			showCloseButton={false}
		>
			<div className="flex flex-col items-center justify-between h-full gap-4 px-4 py-1 ">
				<div></div>
				<div className="flex flex-col items-center">
					<div className="flex items-center gap-3">
						{title && (
							<h3 className="text-lg font-bold text-content">{title}</h3>
						)}
					</div>

					<div className="text-sm leading-relaxed text-center w-60 text-muted">
						{typeof message === 'string' ? <p>{message}</p> : message}
					</div>
				</div>

				<div className="flex flex-col self-start w-full gap-2">
					<Button
						type="button"
						onClick={handleConfirm}
						size="sm"
						disabled={isLoading}
						loading={isLoading}
						className={`w-full ${config.confirmBg} rounded-2xl border-none`}
					>
						{confirmText}
					</Button>

					<Button
						type="button"
						size="sm"
						onClick={onClose}
						disabled={isLoading}
						className="w-full bg-base-300 hover:bg-base-300/90 rounded-2xl"
					>
						{cancelText}
					</Button>
				</div>
			</div>
		</BottomSheet>
	)
}
