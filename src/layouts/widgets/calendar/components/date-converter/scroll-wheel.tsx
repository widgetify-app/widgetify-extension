import { useRef, useEffect, useState, useCallback } from 'react'

const ITEM_HEIGHT = 40
// Minimum cumulative pointer movement (px) before a mousedown+mouseup is treated
// as a drag rather than a click. Below this, it's just an imprecise click.
const DRAG_CLICK_THRESHOLD = 4

interface ScrollWheelProps {
	items: (string | number)[]
	value: string | number
	onChange: (value: string | number) => void
}

export function ScrollWheel({ items, value, onChange }: ScrollWheelProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const rafRef = useRef<number | null>(null)
	const scrollEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const dragRef = useRef({
		active: false,
		startY: 0,
		startScrollTop: 0,
	})
	const suppressClickRef = useRef(false)
	const isMountedRef = useRef(true)

	const [activeIndex, setActiveIndex] = useState<number>(() => {
		const index = items.indexOf(value)
		return index < 0 ? 0 : index
	})

	const getClampedIndex = useCallback(
		(scrollTop: number): number => {
			return Math.max(
				0,
				Math.min(Math.round(scrollTop / ITEM_HEIGHT), items.length - 1)
			)
		},
		[items.length]
	)

	const updateActiveIndex = useCallback(
		(scrollTop: number) => {
			const index = getClampedIndex(scrollTop)
			setActiveIndex((prev) => (prev === index ? prev : index))
		},
		[getClampedIndex]
	)

	useEffect(() => {
		isMountedRef.current = true
		return () => {
			isMountedRef.current = false
		}
	}, [])

	useEffect(() => {
		if (!isMountedRef.current) return
		const container = containerRef.current
		if (!container) return

		const index = items.indexOf(value)
		if (index < 0) return

		const targetScroll = index * ITEM_HEIGHT
		if (container.scrollTop !== targetScroll) {
			container.scrollTo({ top: targetScroll, behavior: 'smooth' })
		}
	}, [value, items.length])

	const snapToNearest = useCallback(() => {
		const container = containerRef.current
		if (!container) return

		const index = getClampedIndex(container.scrollTop)
		setActiveIndex(index)
		onChange(items[index])
		container.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' })
	}, [getClampedIndex, items, onChange])

	const handleScroll = useCallback(() => {
		const container = containerRef.current
		if (!container) return
		updateActiveIndex(container.scrollTop)

		// Wheel/trackpad scrolling doesn't have a single discrete "end" event like drag does (no mouseup)
		// and doesn't land exactly on an item boundary, so we debounce: once scroll events stop arriving for a bit
		// treat that as scroll-end, snap to the nearest item, and fire the same onChange path that click/drag already use
		if (scrollEndTimeoutRef.current !== null) {
			clearTimeout(scrollEndTimeoutRef.current)
		}
		scrollEndTimeoutRef.current = setTimeout(() => {
			scrollEndTimeoutRef.current = null
			if (!dragRef.current.active) {
				snapToNearest()
			}
		}, 120)
	}, [updateActiveIndex, snapToNearest])

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			const container = containerRef.current
			if (!container || dragRef.current.active) return

			dragRef.current = {
				active: true,
				startY: e.clientY,
				startScrollTop: container.scrollTop,
			}
			suppressClickRef.current = false

			container.style.cursor = 'grabbing'
			document.body.style.userSelect = 'none'

			const onMouseMove = (e: MouseEvent) => {
				if (!dragRef.current.active || !containerRef.current) return
				const dy = dragRef.current.startY - e.clientY
				if (Math.abs(dy) > DRAG_CLICK_THRESHOLD) {
					suppressClickRef.current = true
				}
				containerRef.current.scrollTop = dragRef.current.startScrollTop + dy
			}

			const onMouseUp = () => {
				dragRef.current.active = false
				containerRef.current?.style.removeProperty('cursor')
				document.body.style.userSelect = ''
				document.removeEventListener('mousemove', onMouseMove)
				document.removeEventListener('mouseup', onMouseUp)

				// The drag itself generates scroll events, which may have queued up a pending scroll-end snap.
				// We're handling the snap ourselves right here, so cancel it to avoid a redundant duplicate firing shortly after.
				if (scrollEndTimeoutRef.current !== null) {
					clearTimeout(scrollEndTimeoutRef.current)
					scrollEndTimeoutRef.current = null
				}

				const container = containerRef.current
				if (!container) return

				const index = getClampedIndex(container.scrollTop)
				setActiveIndex(index)
				onChange(items[index])
				container.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' })
			}

			document.addEventListener('mousemove', onMouseMove)
			document.addEventListener('mouseup', onMouseUp)
		},
		[getClampedIndex, items]
	)

	const handleItemClick = useCallback(
		(index: number) => {
			if (suppressClickRef.current) {
				suppressClickRef.current = false
				return
			}
			setActiveIndex(index)
			onChange(items[index])
		},
		[items]
	)

	useEffect(() => {
		return () => {
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
			if (scrollEndTimeoutRef.current !== null)
				clearTimeout(scrollEndTimeoutRef.current)
			if (dragRef.current.active) {
				dragRef.current.active = false
				document.body.style.userSelect = ''
			}
		}
	}, [])

	return (
		<div className="relative w-full h-40 overflow-hidden rounded-xl bg-base-200/30">
			<div className="absolute inset-x-0 z-10 h-10 -translate-y-1 pointer-events-none top-1/2 border-y-2 border-primary/30 bg-primary/5" />

			<div
				ref={containerRef}
				onScroll={handleScroll}
				onMouseDown={handleMouseDown}
				className="h-full overflow-y-scroll scrollbar-none cursor-grab"
				onClick={(e) => e.stopPropagation()}
			>
				<div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
				{items.map((item, index) => (
					<div
						key={index}
						onClick={() => handleItemClick(index)}
						className="flex items-center justify-center transition-all"
						style={{ height: `${ITEM_HEIGHT}px` }}
					>
						<span
							className={`block w-full text-center whitespace-normal text-sm font-bold leading-tight transition-all ${
								index === activeIndex
									? 'text-primary scale-110'
									: 'text-muted scale-90 opacity-40'
							}`}
						>
							{item}
						</span>
					</div>
				))}
				<div style={{ height: `${ITEM_HEIGHT}px` }} />
			</div>

			<div className="absolute inset-x-0 top-0 h-16 pointer-events-none bg-linear-to-b from-base-200 to-transparent" />
			<div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-linear-to-t from-base-200 to-transparent" />
		</div>
	)
}
