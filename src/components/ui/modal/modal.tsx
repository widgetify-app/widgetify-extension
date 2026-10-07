import type { VariantProps } from 'class-variance-authority'
import React, { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/common/utils/cn'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import {
	EXIT_ANIMATION_MS,
	useDelayedUnmount,
} from '@/components/ui/modal/use-delayed-unmount'
import {
	modalBoxVariants,
	modalDialogVariants,
	modalScrollVariants,
} from './modal.variants'

const MODAL_EXIT_MS = EXIT_ANIMATION_MS

type ModalProps = VariantProps<typeof modalBoxVariants> & {
	isOpen: boolean
	onClose: () => void
	title?: React.ReactNode
	children: ReactNode
	closeOnBackdropClick?: boolean
	showCloseButton?: boolean
	dismissible?: boolean
	stepAside?: boolean
	className?: string
	zIndex?: number
}

let globalModalCounter = 0
const BASE_MODAL_Z_INDEX = 1000

export function Modal({
	isOpen,
	onClose,
	title,
	size,
	children,
	closeOnBackdropClick = true,
	showCloseButton = true,
	dismissible = true,
	stepAside = false,
	className,
	zIndex: customZIndex,
}: ModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const titleId = useId()
	const [assignedZIndex, setAssignedZIndex] = useState<number>(() => {
		if (isOpen) {
			globalModalCounter += 1
			return customZIndex !== undefined
				? customZIndex
				: BASE_MODAL_Z_INDEX + globalModalCounter * 20
		}
		return customZIndex !== undefined ? customZIndex : BASE_MODAL_Z_INDEX
	})
	const { isOptimalMode } = useGeneralSetting()

	const modalDurationMs = isOptimalMode ? 0 : MODAL_EXIT_MS

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return

		if (isOpen) {
			globalModalCounter += 1
			const computedZ =
				customZIndex !== undefined
					? customZIndex
					: BASE_MODAL_Z_INDEX + globalModalCounter * 20
			setAssignedZIndex(computedZ)
			dialog.setAttribute('open', '')

			const returnFocusTo = document.activeElement
			if (!dialog.contains(returnFocusTo)) dialog.focus()
			return () => {
				if (returnFocusTo instanceof HTMLElement) returnFocusTo.focus()
			}
		}

		dialog.removeAttribute('open')
	}, [isOpen, customZIndex])

	const modalBoxClasses = cn(modalBoxVariants({ size }), className)
	const shouldRenderContent = useDelayedUnmount(isOpen, MODAL_EXIT_MS)

	return createPortal(
		<dialog
			ref={dialogRef}
			dir="rtl"
			aria-labelledby={title ? titleId : undefined}
			aria-modal="true"
			inert={stepAside}
			tabIndex={-1}
			onClick={(e) => {
				e.stopPropagation()
				if (dismissible && closeOnBackdropClick && e.target === dialogRef.current)
					onClose()
			}}
			onKeyDown={(e) => {
				if (e.key !== 'Escape') return
				e.stopPropagation()
				if (dismissible) onClose()
			}}
			onContextMenu={(e) => e.stopPropagation()}
			className={cn(
				'flex items-center justify-center focus:outline-none',
				modalDialogVariants({ stepAside })
			)}
			style={
				{
					'--modal-duration': `${modalDurationMs}ms`,
					zIndex:
						assignedZIndex ??
						(customZIndex !== undefined ? customZIndex : BASE_MODAL_Z_INDEX),
				} as React.CSSProperties
			}
		>
			<div className={modalBoxClasses}>
				{shouldRenderContent && (title || showCloseButton) && (
					<div className="flex items-center justify-between gap-2 mb-2 md:mb-3 md:gap-4">
						{title && (
							<h3
								id={titleId}
								className="text-base font-semibold md:text-lg"
							>
								{title}
							</h3>
						)}
						{showCloseButton && (
							<button
								type="button"
								onClick={onClose}
								disabled={!dismissible}
								className="flex items-center justify-center ms-auto transition-ui cursor-pointer w-7 h-7 md:w-8 md:h-8 bg-surface-3 text-fg-muted hover:bg-fill-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0 border-0! rounded-lg focus-visible:focus-ring"
								aria-label="بستن"
							>
								<Icon name="close" size={16} className="md:hidden" />
								<Icon
									name="close"
									size={16}
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
