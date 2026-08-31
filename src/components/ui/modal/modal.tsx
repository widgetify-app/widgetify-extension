import type { VariantProps } from 'class-variance-authority'
import React, { type ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/common/utils/cn'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/src/icons'
import { EXIT_ANIMATION_MS, useDelayedUnmount } from '@/hooks/use-delayed-unmount'
import {
	modalBoxVariants,
	modalDialogVariants,
	modalScrollVariants,
} from './modal.variants'

export const MODAL_EXIT_MS = EXIT_ANIMATION_MS

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
	const dialogRef = useRef<HTMLDialogElement>(null)
	const { isOptimalMode } = useGeneralSetting()

	const modalDurationMs = isOptimalMode ? 0 : MODAL_EXIT_MS

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return

		if (isOpen) {
			if (!dialog.open) dialog.showModal()
		} else if (dialog.open) {
			dialog.close()
		}
	}, [isOpen])

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return
		const handleCancel = (e: Event) => {
			e.preventDefault() // keep it mounted so the exit animation can play
			onClose()
		}
		dialog.addEventListener('cancel', handleCancel)
		return () => dialog.removeEventListener('cancel', handleCancel)
	}, [onClose])

	const modalBoxClasses = cn(modalBoxVariants({ size }), className)
	const shouldRenderContent = useDelayedUnmount(isOpen, MODAL_EXIT_MS)

	return createPortal(
		<dialog
			ref={dialogRef}
			dir={direction}
			aria-labelledby={typeof title === 'string' ? title : 'modal-title'}
			aria-modal="true"
			onClick={(e) => {
				if (closeOnBackdropClick && e.target === dialogRef.current) onClose()
			}}
			onContextMenu={(e) => e.stopPropagation()}
			className={cn('flex items-center justify-center', modalDialogVariants())}
			style={{ '--modal-duration': `${modalDurationMs}ms` } as React.CSSProperties}
		>
			<div
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
