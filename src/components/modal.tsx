import React, { type ReactNode, useEffect, useRef } from 'react'
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
		w: 'w-[calc(100vw-2rem)] max-w-sm',
		h: 'max-h-[calc(100vh-4rem)] md:max-h-[560px]',
		minH: 'min-h-[180px]',
	},
	md: {
		w: 'w-[calc(100vw-2rem)] max-w-md',
		h: 'max-h-[calc(100vh-4rem)] md:max-h-[640px]',
		minH: 'min-h-[200px]',
	},
	lg: {
		w: 'w-[calc(100vw-2rem)] max-w-lg',
		h: 'max-h-[calc(100vh-4rem)] md:max-h-[720px]',
		minH: 'min-h-[240px]',
	},
	xl: {
		w: 'w-[calc(100vw-2rem)] max-w-4xl',
		h: 'max-h-[calc(100vh-4rem)] md:max-h-[800px]',
		minH: 'min-h-[280px]',
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
	const modalRef = useRef<HTMLDivElement>(null)
	const sizeValue = sizeClasses[size] || sizeClasses.md

	// Lock body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.documentElement.classList.add('modal-isActive')
			document.body.style.overflow = 'hidden'
		} else {
			document.documentElement.classList.remove('modal-isActive')
			document.body.style.overflow = ''
		}
		return () => {
			document.documentElement.classList.remove('modal-isActive')
			document.body.style.overflow = ''
		}
	}, [isOpen])

	// Handle keyboard events
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault()
				onClose()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onClose])

	// Focus management
	useEffect(() => {
		if (isOpen && modalRef.current) {
			const focusableElements = modalRef.current.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
			const firstElement = focusableElements[0] as HTMLElement
			firstElement?.focus()
		}
	}, [isOpen])

	const modalBoxClasses = `
		modal-box overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-4 shadow-xl transition-all duration-200
		${sizeValue.w} ${sizeValue.minH} ${className}
	`

	if (!isOpen) return null

	return createPortal(
		<dialog
			open={isOpen}
			dir={direction}
			aria-labelledby={typeof title === 'string' ? title : 'modal-title'}
			aria-modal="true"
			onClick={() => closeOnBackdropClick && onClose()}
			className="flex items-center justify-center p-2 transition-opacity duration-200 opacity-100 modal modal-middle md:p-4"
		>
			<div
				ref={modalRef}
				onClick={(e) => e.stopPropagation()}
				className={`${modalBoxClasses} animate-modal-in`}
			>
				{(title || showCloseButton) && (
					<div className="relative flex items-center justify-end mb-2 md:mb-3">
						{title && (
							<h3
								id="modal-title"
								className="absolute inset-x-0 text-base font-semibold text-center pointer-events-none md:text-lg"
							>
								{title}
							</h3>
						)}

						{showCloseButton && (
							<button
								type="button"
								onClick={onClose}
								className="flex items-center justify-center transition-all rounded-full cursor-pointer w-7 h-7 md:w-8 md:h-8 bg-base-300 text-muted hover:bg-base-content/10 hover:scale-105 active:scale-95 shrink-0"
								aria-label="Close modal"
							>
								<LuX size={16} className="md:hidden" />
								<LuX size={18} className="hidden md:block" />
							</button>
						)}
					</div>
				)}
				<div
					className={`overflow-y-auto overflow-x-hidden ${sizeValue.h} pr-0.5 md:pr-1`}
				>
					{children}
				</div>
			</div>
		</dialog>,
		document.body
	)
}
