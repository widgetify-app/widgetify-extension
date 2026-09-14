import { useEffect, useRef, useState } from 'react'
import { Portal } from '@/components/ui/portal/portal'
import { cn } from '@/common/utils/cn'
import { popoverMenuVariants } from './popover-menu.variants'

export interface PopoverMenuProps {
	isOpen: boolean
	onClose: () => void
	position?: { x: number; y: number } | null
	triggerRef?: React.RefObject<HTMLElement | null>
	children: React.ReactNode
	className?: string
	width?: number | string
	placement?:
		| 'bottom-start'
		| 'bottom-end'
		| 'bottom-center'
		| 'top-start'
		| 'top-end'
		| 'top-center'
	offset?: number
}

export function PopoverMenu({
	isOpen,
	onClose,
	position,
	triggerRef,
	children,
	className,
	width = 208,
	placement = 'bottom-center',
	offset = 8,
}: PopoverMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null)
	const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)

	useEffect(() => {
		if (!isOpen) {
			setCoords(null)
			return
		}

		const computePosition = () => {
			if (position) {
				const numericWidth = typeof width === 'number' ? width : 208
				const left = Math.min(
					Math.max(12, position.x),
					window.innerWidth - numericWidth - 12
				)
				const top = Math.min(Math.max(12, position.y), window.innerHeight - 260)
				setCoords({ top, left })
				return
			}

			if (triggerRef?.current) {
				const rect = triggerRef.current.getBoundingClientRect()
				const numericWidth = typeof width === 'number' ? width : 208
				let left = rect.left + rect.width / 2 - numericWidth / 2
				let top = rect.bottom + offset

				if (placement === 'bottom-start') {
					left = rect.left
				} else if (placement === 'bottom-end') {
					left = rect.right - numericWidth
				} else if (placement.startsWith('top')) {
					top = rect.top - offset - 100
					if (placement === 'top-start') left = rect.left
					if (placement === 'top-end') left = rect.right - numericWidth
				}

				left = Math.min(Math.max(12, left), window.innerWidth - numericWidth - 12)
				top = Math.min(Math.max(12, top), window.innerHeight - 180)

				setCoords({ top, left })
			}
		}

		computePosition()

		const handleClickOutside = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node) &&
				triggerRef?.current &&
				!triggerRef.current.contains(e.target as Node)
			) {
				onClose()
			} else if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node) &&
				!triggerRef
			) {
				onClose()
			}
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		const handleScroll = () => {
			onClose()
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)
		window.addEventListener('scroll', handleScroll, true)
		window.addEventListener('resize', computePosition)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('scroll', handleScroll, true)
			window.removeEventListener('resize', computePosition)
		}
	}, [isOpen, position, triggerRef, width, placement, offset, onClose])

	if (!isOpen || !coords) return null

	return (
		<Portal topLayer>
			<div
				ref={menuRef}
				style={{
					position: 'fixed',
					top: coords.top,
					left: coords.left,
					width: typeof width === 'number' ? `${width}px` : width,
					zIndex: 99999,
					pointerEvents: 'auto',
				}}
				className={cn(popoverMenuVariants(), className)}
				onClick={(e) => e.stopPropagation()}
				onContextMenu={(e) => e.preventDefault()}
			>
				{children}
			</div>
		</Portal>
	)
}
