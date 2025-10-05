import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

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

const Tooltip = ({
	children,
	content,
	position = 'top',
	offset = 8,
	disableAutoPosition = false,
	className = '',
	contentClassName = '',
	delay = 0,
	alwaysShow = false,
}: TooltipProps) => {
	const [isVisible, setIsVisible] = useState(false)
	const [calculatedPosition, setCalculatedPosition] = useState<Position>(position)
	const [tooltipCoords, setTooltipCoords] = useState({ x: 0, y: 0 })
	const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(null)

	const triggerRef = useRef<HTMLDivElement>(null)
	const tooltipRef = useRef<HTMLDivElement>(null)

	const calculatePosition = () => {
		if (!triggerRef.current || !tooltipRef.current) return

		const triggerRect = triggerRef.current.getBoundingClientRect()
		const tooltipRect = tooltipRef.current.getBoundingClientRect()
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		let newPosition = position
		let x = 0
		let y = 0

		switch (position) {
			case 'top':
				x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
				y = triggerRect.top - tooltipRect.height - offset
				break
			case 'right':
				x = triggerRect.right + offset
				y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
				break
			case 'bottom':
				x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
				y = triggerRect.bottom + offset
				break
			case 'left':
				x = triggerRect.left - tooltipRect.width - offset
				y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
				break
			case 'bottom-right':
				x = triggerRect.right
				y = triggerRect.bottom + offset
				break
			case 'bottom-left':
				x = triggerRect.left - tooltipRect.width
				y = triggerRect.bottom + offset
				break
			case 'top-right':
				x = triggerRect.right
				y = triggerRect.top - tooltipRect.height - offset
				break
			case 'top-left':
				x = triggerRect.left - tooltipRect.width
				y = triggerRect.top - tooltipRect.height - offset
				break
		}

		if (!disableAutoPosition) {
			if (position === 'top' && y < 0) {
				y = triggerRect.bottom + offset
				newPosition = 'bottom'
			} else if (position === 'bottom' && y + tooltipRect.height > viewportHeight) {
				y = triggerRect.top - tooltipRect.height - offset
				newPosition = 'top'
			} else if (position === 'left' && x < 0) {
				x = triggerRect.right + offset
				newPosition = 'right'
			} else if (position === 'right' && x + tooltipRect.width > viewportWidth) {
				x = triggerRect.left - tooltipRect.width - offset
				newPosition = 'left'
			}
		}

		x = Math.max(10, Math.min(x, viewportWidth - tooltipRect.width - 10))
		y = Math.max(10, Math.min(y, viewportHeight - tooltipRect.height - 10))

		setCalculatedPosition(newPosition)
		setTooltipCoords({ x, y })
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

	const variants = {
		top: {
			hidden: { opacity: 0, y: -5 },
			visible: { opacity: 1, y: 0 },
		},
		right: {
			hidden: { opacity: 0, x: 5 },
			visible: { opacity: 1, x: 0 },
		},
		bottom: {
			hidden: { opacity: 0, y: 5 },
			visible: { opacity: 1, y: 0 },
		},
		left: {
			hidden: { opacity: 0, x: -5 },
			visible: { opacity: 1, x: 0 },
		},
		'bottom-right': {
			hidden: { opacity: 0, y: 5 },
			visible: { opacity: 1, y: 0 },
		},
		'bottom-left': {
			hidden: { opacity: 0, y: 2 },
			visible: { opacity: 1, y: 0 },
		},
		'top-right': {
			hidden: { opacity: 0, y: -5 },
			visible: { opacity: 1, y: 0 },
		},
		'top-left': {
			hidden: { opacity: 0, y: -5 },
			visible: { opacity: 1, y: 0 },
		},
	}

	if (!content) {
		return <>{children}</>
	}

	return (
		<>
			<div
				ref={triggerRef}
				className={`inline-block ${className}`}
				onMouseEnter={showTooltip}
				onMouseLeave={hideTooltip}
				onFocus={showTooltip}
				onBlur={hideTooltip}
			>
				{children}
			</div>

			{(alwaysShow || isVisible) &&
				ReactDOM.createPortal(
					<LazyMotion features={domAnimation}>
						<AnimatePresence>
							<m.div
								ref={tooltipRef}
								className={`tooltip fixed  rounded-xl py-1 px-2 text-xs max-w-xs bg-base-300 shadow ${contentClassName}`}
								style={{
									left: tooltipCoords.x,
									top: tooltipCoords.y,
									zIndex: 9999,
								}}
								initial="hidden"
								animate="visible"
								exit="hidden"
								variants={variants[calculatedPosition]}
								transition={{ duration: 0.2 }}
								onMouseEnter={showTooltip}
								onMouseLeave={hideTooltip}
							>
								{content}
							</m.div>
						</AnimatePresence>
					</LazyMotion>,
					document.body
				)}
		</>
	)
}

export default Tooltip
