import React, { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { LuX } from 'react-icons/lu'

type ModalProps = {
	isOpen: boolean
	onClose: () => void
	title?: React.ReactNode
	size?: 'sm' | 'md' | 'lg' | 'xl'
	children: ReactNode
	direction?: 'rtl' | 'ltr'
	closeOnBackdropClick?: boolean
	showCloseButton?: boolean
	className?: string
}

const sizeClasses = {
	sm: {
		w: 'max-w-sm',
		h: 'max-h-[70vh]',
	},
	md: {
		w: 'max-w-md',
		h: 'max-h-[80vh]',
	},
	lg: {
		w: 'max-w-lg',
		h: 'max-h-[85vh]',
	},
	xl: {
		w: 'max-w-6xl h-[90%]',
		h: 'max-h-[90vh]',
	},
} as const

export default function Modal({
	isOpen,
	onClose,
	title,
	size = 'md',
	children,
	closeOnBackdropClick = true,
	direction = 'ltr',
	showCloseButton = true,
	className = '',
}: ModalProps) {
	const sizeValue = sizeClasses[size] || sizeClasses.md

	useEffect(() => {
		document.documentElement.classList.toggle('modal-isActive', isOpen)
		return () => document.documentElement.classList.remove('modal-isActive')
	}, [isOpen])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) onClose()
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onClose])

	const modalBoxClasses = `
		modal-box overflow-hidden rounded-2xl p-4 shadow-xl transition-all duration-200
		${sizeValue.w} ${className}
	`

	if (!isOpen) return null

	return createPortal(
		<dialog
			open={isOpen}
			dir={direction}
			aria-labelledby={typeof title === 'string' ? title : undefined}
			aria-modal="true"
			onClick={() => closeOnBackdropClick && onClose()}
			className={`modal modal-middle  flex items-center justify-center transition-opacity duration-200 ${
				isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
			}`}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className={`${modalBoxClasses} transform ${
					isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
				}`}
			>
				{(title || showCloseButton) && (
					<div className="flex items-center justify-between mb-2">
						{title && <h3 className="text-lg font-medium">{title}</h3>}
						{showCloseButton && (
							<button
								onClick={onClose}
								className="flex items-center justify-center transition-transform rounded-full cursor-pointer w-7 h-7 bg-base-300 text-muted hover:scale-105 active:scale-95"
								aria-label="Close"
							>
								<LuX size={16} />
							</button>
						)}
					</div>
				)}
				<div className={`overflow-y-auto ${sizeValue.h}`}>{children}</div>
			</div>
		</dialog>,
		document.body
	)
}
