import { Motion as motion, Presence } from '@/common/motion'

import { type ReactNode, useEffect, useRef, useState, type RefObject } from 'react'
import { Portal } from '../portal/portal'
import {
	type AnchoredPlacement,
	isAnchorInViewport,
	resolveAnchoredPlacement,
} from '../utils/anchored-position'

type Position =
	| 'top'
	| 'right'
	| 'bottom'
	| 'left'
	| 'bottom-right'
	| 'bottom-left'
	| 'top-right'
	| 'top-left'

interface ClickableTooltipProps {
	children?: ReactNode
	content: ReactNode | null
	position?: Position
	offset?: number
	disableAutoPosition?: boolean
	className?: string
	contentClassName?: string
	closeOnClickOutside?: boolean
	boundaryRef?: RefObject<HTMLElement | null>
	triggerRef: RefObject<HTMLElement | null>
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
}

const ClickableTooltip = ({
	content,
	position = 'top',
	offset = 4,
	disableAutoPosition = false,
	contentClassName = '',
	closeOnClickOutside = true,
	boundaryRef,
	triggerRef,
	isOpen,
	setIsOpen,
}: ClickableTooltipProps) => {
	const [placement, setPlacement] = useState<AnchoredPlacement | null>(null)

	const tooltipRef = useRef<HTMLDivElement>(null)
	const anchorElement = triggerRef.current
	const isPlacedOnAnchor = placement?.anchor === anchorElement

	const calculatePosition = () => {
		if (!triggerRef.current || !tooltipRef.current) return

		const anchor = triggerRef.current.getBoundingClientRect()
		const viewport = { width: window.innerWidth, height: window.innerHeight }

		if (!isAnchorInViewport(anchor, viewport)) {
			setIsOpen(false)
			return
		}

		setPlacement({
			anchor: triggerRef.current,
			...resolveAnchoredPlacement(
				anchor,
				{
					width: tooltipRef.current.offsetWidth,
					height: tooltipRef.current.offsetHeight,
				},
				viewport,
				position,
				offset,
				!disableAutoPosition
			),
		})
	}

	const toggleTooltip = () => {
		setIsOpen(!isOpen)
	}

	useEffect(() => {
		if (isOpen) {
			calculatePosition()

			const handleReposition = () => calculatePosition()
			window.addEventListener('resize', handleReposition)
			window.addEventListener('scroll', handleReposition, true)

			return () => {
				window.removeEventListener('resize', handleReposition)
				window.removeEventListener('scroll', handleReposition, true)
			}
		}
	}, [isOpen, anchorElement])

	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.stopPropagation()
				setIsOpen(false)
				triggerRef.current?.focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen])

	useEffect(() => {
		if (!closeOnClickOutside || !isOpen) return

		const handleClickOutside = (e: MouseEvent) => {
			if (!triggerRef.current || !tooltipRef.current) return

			const target = e.target as Node
			if (
				triggerRef.current.contains(target) ||
				tooltipRef.current.contains(target) ||
				boundaryRef?.current?.contains(target)
			) {
				return
			}

			setIsOpen(false)
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen, closeOnClickOutside])

	useEffect(() => {
		if (!triggerRef?.current) return

		const handleClick = (e: Event) => {
			e.preventDefault()
			e.stopPropagation()
			toggleTooltip()
		}

		const element = triggerRef.current
		element.addEventListener('click', handleClick, true)

		return () => {
			element.removeEventListener('click', handleClick, true)
		}
	}, [triggerRef, isOpen])

	const variants = {
		top: {
			hidden: { opacity: 0, y: -5, scale: 0.95 },
			visible: { opacity: 1, y: 0, scale: 1 },
		},
		right: {
			hidden: { opacity: 0, x: 5, scale: 0.95 },
			visible: { opacity: 1, x: 0, scale: 1 },
		},
		bottom: {
			hidden: { opacity: 0, y: 5, scale: 0.95 },
			visible: { opacity: 1, y: 0, scale: 1 },
		},
		left: {
			hidden: { opacity: 0, x: -5, scale: 0.95 },
			visible: { opacity: 1, x: 0, scale: 1 },
		},
		'bottom-right': {
			hidden: { opacity: 0, y: 5, scale: 0.95 },
			visible: { opacity: 1, y: 0, scale: 1 },
		},
		'bottom-left': {
			hidden: { opacity: 0, y: 5, scale: 0.95 },
			visible: { opacity: 1, y: 0, scale: 1 },
		},
		'top-right': {
			hidden: { opacity: 0, y: -5, scale: 0.95 },
			visible: { opacity: 1, y: 0, scale: 1 },
		},
		'top-left': {
			hidden: { opacity: 0, y: -5, scale: 0.95 },
			visible: { opacity: 1, y: 0, scale: 1 },
		},
	}

	if (!content) {
		return null
	}

	return (
		<Portal topLayer>
			<Presence mode="wait">
				{isOpen && (
					<motion.div
						ref={tooltipRef}
						className={`fixed text-xs pointer-events-auto max-w-xs  bg-transparent! elevation-md bg-glass rounded-2xl ${contentClassName}`}
						style={{
							left: placement?.x ?? 0,
							top: placement?.y ?? 0,
							visibility: isPlacedOnAnchor ? 'visible' : 'hidden',
							zIndex: 9999,
						}}
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={variants[placement?.side ?? position]}
						transition={{ duration: 0.15, ease: 'easeOut' }}
					>
						{content}
					</motion.div>
				)}
			</Presence>
		</Portal>
	)
}

export { ClickableTooltip }
