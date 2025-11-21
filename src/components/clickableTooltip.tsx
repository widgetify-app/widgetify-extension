import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import {
	type ReactNode,
	useEffect,
	useRef,
	useState,
	createContext,
	useContext,
} from 'react'
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

interface ClickableTooltipProps {
	children: ReactNode
	content: ReactNode | null
	position?: Position
	offset?: number
	disableAutoPosition?: boolean
	className?: string
	contentClassName?: string
	closeOnClickOutside?: boolean
}

export const TooltipContext = createContext<{
	openTooltipId: string | null
	setOpenTooltipId: (id: string | null) => void
}>({
	openTooltipId: null,
	setOpenTooltipId: () => {},
})

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
	const [openTooltipId, setOpenTooltipId] = useState<string | null>(null)

	return (
		<TooltipContext.Provider value={{ openTooltipId, setOpenTooltipId }}>
			{children}
		</TooltipContext.Provider>
	)
}

const ClickableTooltip = ({
	children,
	content,
	position = 'top',
	offset = 8,
	disableAutoPosition = false,
	className = '',
	contentClassName = '',
	closeOnClickOutside = true,
}: ClickableTooltipProps) => {
	const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`).current
	const context = useContext(TooltipContext)

	const [calculatedPosition, setCalculatedPosition] = useState<Position>(position)
	const [tooltipCoords, setTooltipCoords] = useState({ x: 0, y: 0 })

	const triggerRef = useRef<HTMLDivElement>(null)
	const tooltipRef = useRef<HTMLDivElement>(null)

	const isVisible = context ? context.openTooltipId === tooltipId : false

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

	const toggleTooltip = () => {
		if (context) {
			context.setOpenTooltipId(isVisible ? null : tooltipId)
		}
	}

	useEffect(() => {
		if (isVisible) {
			calculatePosition()

			const handleResize = () => calculatePosition()
			window.addEventListener('resize', handleResize)
			window.addEventListener('scroll', handleResize, true)

			return () => {
				window.removeEventListener('resize', handleResize)
				window.removeEventListener('scroll', handleResize, true)
			}
		}
	}, [isVisible])

	useEffect(() => {
		if (!closeOnClickOutside || !isVisible || !context) return

		const handleClickOutside = (e: MouseEvent) => {
			if (
				triggerRef.current &&
				tooltipRef.current &&
				!triggerRef.current.contains(e.target as Node) &&
				!tooltipRef.current.contains(e.target as Node)
			) {
				context.setOpenTooltipId(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isVisible, closeOnClickOutside, context])

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		toggleTooltip()
	}

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
		return <>{children}</>
	}

	return (
		<>
			<div
				ref={triggerRef}
				className={`inline-block ${className}`}
				onClickCapture={handleClick}
			>
				{children}
			</div>

			{ReactDOM.createPortal(
				<LazyMotion features={domAnimation}>
					<AnimatePresence mode="wait">
						{isVisible && (
							<m.div
								key={tooltipId}
								ref={tooltipRef}
								className={`fixed rounded-xl py-1 px-2 text-xs max-w-xs bg-base-300 shadow bg-glass  ${contentClassName}`}
								style={{
									left: tooltipCoords.x,
									top: tooltipCoords.y,
									zIndex: 9999,
								}}
								initial="hidden"
								animate="visible"
								exit="hidden"
								variants={variants[calculatedPosition]}
								transition={{ duration: 0.15, ease: 'easeOut' }}
							>
								{content}
							</m.div>
						)}
					</AnimatePresence>
				</LazyMotion>,
				document.body
			)}
		</>
	)
}

export { ClickableTooltip }
