import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Portal } from '@/components/ui/portal/portal'
import { cn } from '@/common/utils/cn'
import { fitMenuHorizontally, fitMenuVertically } from '../utils/menu-position'
import { popoverMenuVariants } from './popover-menu.variants'

interface PopoverMenuProps {
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

interface MenuCoords {
	top: number
	left: number
	flipBottom: number
	isFitted: boolean
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
	const [coords, setCoords] = useState<MenuCoords | null>(null)

	useEffect(() => {
		if (!isOpen) {
			setCoords(null)
			return
		}

		const computePosition = () => {
			const numericWidth = typeof width === 'number' ? width : 208

			if (position) {
				setCoords({
					top: position.y,
					left: fitMenuHorizontally(
						position.x,
						numericWidth,
						window.innerWidth
					),
					flipBottom: position.y,
					isFitted: false,
				})
				return
			}

			if (triggerRef?.current) {
				const rect = triggerRef.current.getBoundingClientRect()
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

				setCoords({
					top,
					left: fitMenuHorizontally(left, numericWidth, window.innerWidth),
					flipBottom: rect.top - offset,
					isFitted: false,
				})
			}
		}

		computePosition()

		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node
			if (menuRef.current?.contains(target)) return
			if (triggerRef?.current?.contains(target)) return
			onClose()
		}

		const focusableItems = () =>
			Array.from(
				menuRef.current?.querySelectorAll<HTMLElement>(
					'button:not(:disabled), a[href], input'
				) ?? []
			)

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				triggerRef?.current?.focus()
				onClose()
				return
			}

			if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
			const items = focusableItems()
			if (!items.length) return

			e.preventDefault()
			const current = items.indexOf(document.activeElement as HTMLElement)
			const step = e.key === 'ArrowDown' ? 1 : -1
			const next =
				current < 0
					? step > 0
						? 0
						: items.length - 1
					: (current + step + items.length) % items.length
			items[next].focus()
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

	useLayoutEffect(() => {
		if (!coords || coords.isFitted || !menuRef.current) return
		setCoords({
			...coords,
			top: fitMenuVertically({
				top: coords.top,
				flipBottom: coords.flipBottom,
				height: menuRef.current.offsetHeight,
				viewportHeight: window.innerHeight,
			}),
			isFitted: true,
		})
	}, [coords])

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
					zIndex: 'var(--z-dropdown)',
					pointerEvents: 'auto',
					visibility: coords.isFitted ? 'visible' : 'hidden',
				}}
				className={cn(popoverMenuVariants(), className)}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</Portal>
	)
}
