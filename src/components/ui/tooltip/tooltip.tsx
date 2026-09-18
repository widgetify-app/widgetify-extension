import { twMerge } from 'tailwind-merge'
import { Motion as motion, Presence } from '@/common/motion'
import { type ReactNode, useEffect, useRef, useState } from 'react'
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

interface TooltipProps {
	children: ReactNode
	content: ReactNode | null
	position?: Position
	offset?: number
	disableAutoPosition?: boolean
	className?: string
	contentClassName?: string
	delay?: number
	alwaysShow?: boolean
}

export const Tooltip = ({
	children,
	content,
	position = 'top',
	offset = 10,
	disableAutoPosition = false,
	className = '',
	contentClassName = '',
	delay = 0,
	alwaysShow = false,
}: TooltipProps) => {
	const [isVisible, setIsVisible] = useState(false)
	const [placement, setPlacement] = useState<AnchoredPlacement | null>(null)
	const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(null)

	const triggerRef = useRef<HTMLDivElement>(null)
	const tooltipRef = useRef<HTMLDivElement>(null)
	const isPlacedOnAnchor = placement?.anchor === triggerRef.current

	const calculatePosition = () => {
		if (!triggerRef.current || !tooltipRef.current) return

		const anchor = triggerRef.current.getBoundingClientRect()
		const viewport = { width: window.innerWidth, height: window.innerHeight }

		if (!alwaysShow && !isAnchorInViewport(anchor, viewport)) {
			setIsVisible(false)
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

	const showTooltip = () => {
		if (delay && delay > 0) {
			const timeout = setTimeout(() => {
				setIsVisible(true)
			}, delay)
			setDelayTimeout(timeout)
		} else {
			setIsVisible(true)
		}
	}

	const hideTooltip = () => {
		if (delayTimeout) {
			clearTimeout(delayTimeout)
			setDelayTimeout(null)
		}
		setIsVisible(false)
	}

	useEffect(() => {
		if (alwaysShow || isVisible) {
			calculatePosition()

			const handleResize = () => calculatePosition()
			window.addEventListener('resize', handleResize)
			window.addEventListener('scroll', handleResize, true)

			return () => {
				window.removeEventListener('resize', handleResize)
				window.removeEventListener('scroll', handleResize, true)
			}
		}
	}, [alwaysShow, isVisible])

	useEffect(() => {
		return () => {
			if (delayTimeout) {
				clearTimeout(delayTimeout)
			}
		}
	}, [delayTimeout])

	// Refined animations
	const variants = {
		top: {
			hidden: { opacity: 0, y: 2 },
			visible: { opacity: 1, y: 0 },
		},
		right: {
			hidden: { opacity: 0, x: -2 },
			visible: { opacity: 1, x: 0 },
		},
		bottom: {
			hidden: { opacity: 0, y: -2 },
			visible: { opacity: 1, y: 0 },
		},
		left: {
			hidden: { opacity: 0, x: 2 },
			visible: { opacity: 1, x: 0 },
		},
		// For corner positions, use the closest main direction for animation
		'bottom-right': { hidden: { opacity: 0, y: -2 }, visible: { opacity: 1, y: 0 } },
		'bottom-left': { hidden: { opacity: 0, y: -2 }, visible: { opacity: 1, y: 0 } },
		'top-right': { hidden: { opacity: 0, y: 2 }, visible: { opacity: 1, y: 0 } },
		'top-left': { hidden: { opacity: 0, y: 2 }, visible: { opacity: 1, y: 0 } },
	}

	if (!content) {
		return <>{children}</>
	}

	// Helper to get arrow classes based on calculated position
	const getArrowClasses = (pos: Position) => {
		const base = 'absolute w-0 h-0 border-solid'
		switch (pos) {
			case 'top':
			case 'top-left':
			case 'top-right':
				return `${base} bottom-[-5px] left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-content`
			case 'bottom':
			case 'bottom-left':
			case 'bottom-right':
				return `${base} top-[-5px] left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-content`
			case 'left':
				return `${base} right-[-5px] top-1/2 -translate-y-1/2 border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-content`
			case 'right':
				return `${base} left-[-5px] top-1/2 -translate-y-1/2 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-content`
		}
	}

	return (
		<>
			<div
				ref={triggerRef}
				className={twMerge('inline-block', className)}
				onMouseEnter={showTooltip}
				onMouseLeave={hideTooltip}
				onFocus={showTooltip}
				onBlur={hideTooltip}
			>
				{children}
			</div>

			{(alwaysShow || isVisible) && (
				<Portal topLayer>
					<Presence>
						<motion.div
							ref={tooltipRef}
							className={`tooltip fixed pointer-events-auto rounded-lg py-1.5 px-3 text-xs max-w-xs bg-content shadow-lg z-popover  ${contentClassName}`}
							style={{
								left: placement?.x ?? 0,
								top: placement?.y ?? 0,
								visibility: isPlacedOnAnchor ? 'visible' : 'hidden',
							}}
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={variants[placement?.side ?? position]}
							transition={{ duration: 0.15, ease: 'easeOut' }}
							onMouseEnter={showTooltip}
							onMouseLeave={hideTooltip}
						>
							{content}
							<div
								className={getArrowClasses(placement?.side ?? position)}
							/>
						</motion.div>
					</Presence>
				</Portal>
			)}
		</>
	)
}
