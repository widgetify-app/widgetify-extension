import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Portal } from '@/components/ui/portal/portal'
import { cn } from '@/common/utils/cn'
import {
	fitMenuHorizontally,
	MENU_EDGE,
	type MenuSide,
	pickMenuSide,
	placeMenuOnSide,
} from '../utils/menu-position'
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
	ready?: boolean
	bottomGap?: number
}

interface MenuCoords {
	anchorTop: number
	top: number
	left: number
	flipBottom: number
	side: MenuSide | null
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
	ready = true,
	bottomGap = 0,
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
					anchorTop: position.y,
					top: position.y,
					left: fitMenuHorizontally(
						position.x,
						numericWidth,
						window.innerWidth
					),
					flipBottom: position.y,
					side: null,
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
					anchorTop: top,
					top,
					left: fitMenuHorizontally(left, numericWidth, window.innerWidth),
					flipBottom: rect.top - offset,
					side: null,
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
		if (!ready || !coords || coords.side || !menuRef.current) return
		const height = menuRef.current.offsetHeight
		const fit = {
			top: coords.anchorTop,
			flipBottom: coords.flipBottom,
			viewportHeight: window.innerHeight - bottomGap,
		}
		const side = pickMenuSide({ ...fit, height })
		setCoords({ ...coords, side, top: placeMenuOnSide(side, { ...fit, height }) })
	}, [coords, ready, bottomGap])

	const isFitted = Boolean(coords?.side)

	useEffect(() => {
		const menu = menuRef.current
		if (!isFitted || !menu) return

		const observer = new ResizeObserver(() =>
			setCoords((current) =>
				current?.side
					? {
							...current,
							top: placeMenuOnSide(current.side, {
								top: current.anchorTop,
								flipBottom: current.flipBottom,
								height: menu.offsetHeight,
								viewportHeight: window.innerHeight - bottomGap,
							}),
						}
					: current
			)
		)
		observer.observe(menu)
		return () => observer.disconnect()
	}, [isFitted, bottomGap])

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
					maxHeight: `calc(100vh - ${MENU_EDGE * 2 + bottomGap}px)`,
					overflowY: 'auto',
					zIndex: 'var(--z-dropdown)',
					pointerEvents: 'auto',
					visibility: isFitted ? 'visible' : 'hidden',
				}}
				className={cn(popoverMenuVariants(), className)}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</Portal>
	)
}
