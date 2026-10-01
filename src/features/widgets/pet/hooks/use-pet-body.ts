import { type RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { PetLogicProps, Position } from '../types'
import { clampToBounds, getMovementBounds } from '../utils/pet-movement'

const AIRBORNE_HEIGHT = 0.5

interface ContainerSize {
	width: number
	height: number
}

export function usePetBody(propsRef: RefObject<PetLogicProps>) {
	const containerRef = useRef<HTMLButtonElement>(null)
	const petRef = useRef<HTMLDivElement>(null)

	const [direction, setDirection] = useState(1)
	const [airborne, setAirborne] = useState(false)

	const positionRef = useRef<Position>({ x: 30, y: 0 })
	const paintedRef = useRef('')
	const airborneRef = useRef(false)
	const sizeRef = useRef<ContainerSize>({ width: 0, height: 0 })
	const directionRef = useRef(1)

	const paint = useCallback((position: Position) => {
		const element = petRef.current
		if (!element) return

		const x = Math.round(position.x * 100) / 100
		const y = Math.round(position.y * 100) / 100
		const value = `translate3d(${x}px, ${-y}px, 0)`
		if (value === paintedRef.current) return

		paintedRef.current = value
		element.style.transform = value
	}, [])

	const applyPosition = useCallback(
		(next: Position) => {
			const previous = positionRef.current
			if (previous.x === next.x && previous.y === next.y) return

			positionRef.current = next
			paint(next)

			const isAirborne = next.y > AIRBORNE_HEIGHT
			if (isAirborne !== airborneRef.current) {
				airborneRef.current = isAirborne
				setAirborne(isAirborne)
			}
		},
		[paint]
	)

	const applyDirection = useCallback((next: number) => {
		if (directionRef.current === next) return
		directionRef.current = next
		setDirection(next)
	}, [])

	const getBounds = useCallback(() => {
		const { dimensions } = propsRef.current
		return getMovementBounds(
			sizeRef.current.width,
			sizeRef.current.height,
			dimensions.width,
			dimensions.size,
			dimensions.maxHeight
		)
	}, [propsRef])

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) return

		sizeRef.current = { width: container.offsetWidth, height: container.offsetHeight }
		paint(positionRef.current)

		const observer = new ResizeObserver(() => {
			sizeRef.current = {
				width: container.offsetWidth,
				height: container.offsetHeight,
			}

			const bounds = getBounds()
			if (bounds.maxX <= bounds.minX && bounds.maxY <= 0) return
			applyPosition(clampToBounds(positionRef.current, bounds))
		})

		observer.observe(container)
		return () => observer.disconnect()
	}, [getBounds, applyPosition, paint])

	return {
		containerRef,
		petRef,
		positionRef,
		directionRef,
		direction,
		airborne,
		applyPosition,
		applyDirection,
		getBounds,
	}
}
