import type { VariantProps } from 'class-variance-authority'
import React, { type ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/src/icons'
import { EXIT_ANIMATION_MS, useDelayedUnmount } from '@/hooks/use-delayed-unmount'
import { modalBoxVariants, modalScrollVariants } from './modal.variants'

export const MODAL_EXIT_MS = EXIT_ANIMATION_MS

let activeModalCount = 0
const BASE_Z_INDEX = 1000

export type ModalProps = VariantProps<typeof modalBoxVariants> & {
	isOpen: boolean
	onClose: () => void
	title?: React.ReactNode
	children: ReactNode
	direction?: 'rtl' | 'ltr'
	closeOnBackdropClick?: boolean
	showCloseButton?: boolean
	className?: string
}

export function Modal({
	isOpen,
	onClose,
	title,
	size,
	children,
	closeOnBackdropClick = true,
	direction = 'ltr',
	showCloseButton = true,
	className,
}: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null)
	const [zIndex, setZIndex] = useState<number>(BASE_Z_INDEX)

	// Lock body scroll and assign dynamic z-index stacking when modal is open
	useEffect(() => {
		if (isOpen) {
			activeModalCount += 1
			setZIndex(BASE_Z_INDEX + activeModalCount * 10)
			document.documentElement.classList.add('modal-isActive')
			document.body.style.overflow = 'hidden'
		} else {
			if (activeModalCount > 0) {
				activeModalCount -= 1
			}
			if (activeModalCount === 0) {
				document.documentElement.classList.remove('modal-isActive')
				document.body.style.overflow = ''
			}
		}
		return () => {
			if (isOpen) {
				if (activeModalCount > 0) {
					activeModalCount -= 1
				}
				if (activeModalCount === 0) {
					document.documentElement.classList.remove('modal-isActive')
					document.body.style.overflow = ''
				}
			}
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

	const modalBoxClasses = cn(modalBoxVariants({ size }), className)
	const shouldRenderContent = useDelayedUnmount(isOpen, MODAL_EXIT_MS)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		const frame = requestAnimationFrame(() => setIsMounted(true))
		return () => cancelAnimationFrame(frame)
	}, [])

	return createPortal(
		<dialog
			open={isOpen && isMounted}
			dir={direction}
			aria-labelledby={typeof title === 'string' ? title : 'modal-title'}
			aria-modal="true"
			onClick={() => closeOnBackdropClick && onClose()}
			onContextMenu={(e) => e.stopPropagation()}
			className="flex items-center justify-center p-2 modal modal-middle md:p-4"
			style={{ zIndex }}
		>
			<div
				ref={modalRef}
				onClick={(e) => e.stopPropagation()}
				onContextMenu={(e) => e.stopPropagation()}
				className={modalBoxClasses}
			>
				{shouldRenderContent && (title || showCloseButton) && (
					<div className="flex items-center justify-between gap-2 mb-2 md:mb-3 md:gap-4">
						{title && (
							<h3
								id="modal-title"
								className="text-base font-semibold md:text-lg"
							>
								{title}
							</h3>
						)}
						{showCloseButton && (
							<button
								type="button"
								onClick={onClose}
								className="flex items-center justify-center transition-all rounded-full cursor-pointer w-7 h-7 md:w-8 md:h-8 bg-base-300 text-muted hover:bg-base-content/10 hover:scale-105 active:scale-95 shrink-0 outline-0! border-0!"
								aria-label="Close modal"
							>
								<Icon name="close" size={16} className="md:hidden" />
								<Icon
									name="close"
									size={18}
									className="hidden md:block"
								/>
							</button>
						)}
					</div>
				)}
				<div className={modalScrollVariants({ size })}>
					{shouldRenderContent && children}
				</div>
			</div>
		</dialog>,
		document.body
	)
}
