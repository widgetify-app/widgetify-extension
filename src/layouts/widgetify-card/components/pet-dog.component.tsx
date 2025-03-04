import { useCallback, useEffect, useRef, useState } from 'react'
import idle from '../../../assets/animals/akita_idle_8fps.gif'
import lie from '../../../assets/animals/akita_lie_8fps.gif'
import running from '../../../assets/animals/akita_run_8fps.gif'
import swipe from '../../../assets/animals/akita_swipe_8fps.gif'
import walking from '../../../assets/animals/akita_walk_fast_8fps.gif'

export const DogComponent = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [position, setPosition] = useState({ x: 30, y: 0 })
	const [direction, setDirection] = useState(1)
	const [action, setAction] = useState<
		'idle' | 'walk' | 'run' | 'sit' | 'stand' | 'climb'
	>('idle')
	const [actionTimer, setActionTimer] = useState(0)
	const [behaviorState, setBehaviorState] = useState<'roaming' | 'resting' | 'climbing'>(
		'resting',
	)
	const [targetX, setTargetX] = useState<number | null>(null)
	const [isMovingToTarget, setIsMovingToTarget] = useState(false)

	const DOG_SIZE = 32
	const WALK_SPEED = 1.8
	const RUN_SPEED = 3.5
	const CLIMB_SPEED = 1.2
	const MAX_HEIGHT = 100

	const WALK_DURATION = { min: 3000, max: 8000 }
	const RUN_DURATION = { min: 1500, max: 4000 }
	const REST_DURATION = { min: 5000, max: 10000 }
	const CLIMB_DURATION = { min: 4000, max: 7000 }

	const getMovementBounds = useCallback(() => {
		const container = containerRef.current
		return {
			minX: 10,
			maxX: (container?.offsetWidth || 300) - DOG_SIZE - 10,
			minY: 0,
			maxY: MAX_HEIGHT,
		}
	}, [])

	const isNearWall = useCallback(() => {
		const bounds = getMovementBounds()
		return position.x <= bounds.minX + 5 || position.x >= bounds.maxX - 5
	}, [position.x, getMovementBounds])

	const getCurrentSpeed = useCallback(() => {
		return action === 'run' ? RUN_SPEED : WALK_SPEED
	}, [action])

	const handleClick = useCallback(
		(e: MouseEvent) => {
			const container = containerRef.current
			if (container) {
				const rect = container.getBoundingClientRect()
				const clickX = e.clientX - rect.left
				const bounds = getMovementBounds()
				const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, clickX))

				if (isMovingToTarget) {
					setIsMovingToTarget(false)
					setTargetX(null)
				}

				setTargetX(clampedX)
				setIsMovingToTarget(true)

				if (action === 'sit' || action === 'idle') {
					setAction('stand')
					setTimeout(() => {
						setAction('walk')
						setBehaviorState('roaming')
					}, 500)
				} else {
					setAction('walk')
					setBehaviorState('roaming')
				}
			}
		},
		[action, getMovementBounds, isMovingToTarget],
	)

	const updateBehavior = useCallback(() => {
		if (!isMovingToTarget && actionTimer <= 0) {
			const random = Math.random()
			if (behaviorState === 'roaming') {
				if (isNearWall() && random > 0.7) {
					setBehaviorState('climbing')
					setAction('climb')
					setActionTimer(
						Math.floor(
							Math.random() * (CLIMB_DURATION.max - CLIMB_DURATION.min) +
								CLIMB_DURATION.min,
						),
					)
				} else {
					setBehaviorState('resting')
					const shouldSit = Math.random() > 0.5
					setAction(shouldSit ? 'sit' : 'idle')
					setActionTimer(
						Math.floor(
							Math.random() * (REST_DURATION.max - REST_DURATION.min) + REST_DURATION.min,
						),
					)
				}
			} else if (behaviorState === 'climbing') {
				setBehaviorState('resting')
				setAction('stand')
				setActionTimer(
					Math.floor(
						Math.random() * (REST_DURATION.max - REST_DURATION.min) + REST_DURATION.min,
					),
				)
			} else {
				setBehaviorState('roaming')
				const shouldRun = Math.random() > 0.6
				setAction(shouldRun ? 'run' : 'walk')
				setActionTimer(
					Math.floor(
						Math.random() *
							(shouldRun
								? RUN_DURATION.max - RUN_DURATION.min + RUN_DURATION.min
								: WALK_DURATION.max - WALK_DURATION.min + WALK_DURATION.min),
					),
				)
			}
		} else if (!isMovingToTarget) {
			setActionTimer((prev) => prev - 16)
		}
	}, [actionTimer, behaviorState, isNearWall, isMovingToTarget])

	const physicsUpdate = useCallback(() => {
		updateBehavior()

		if (isMovingToTarget && targetX !== null && action === 'walk') {
			setPosition((prev) => {
				const bounds = getMovementBounds()
				const delta = targetX - prev.x
				const distance = Math.abs(delta)

				if (distance <= WALK_SPEED) {
					setIsMovingToTarget(false)
					setTargetX(null)
					setAction('idle')
					return { x: targetX, y: prev.y }
				}

				const newDirection = delta > 0 ? 1 : -1
				setDirection(newDirection)

				const newX = prev.x + newDirection * WALK_SPEED

				return {
					x: Math.max(bounds.minX, Math.min(bounds.maxX, newX)),
					y: prev.y,
				}
			})
		} else if (action === 'walk' || action === 'run') {
			setPosition((prev) => {
				const bounds = getMovementBounds()
				let newX = prev.x + direction * getCurrentSpeed()
				if (newX >= bounds.maxX) {
					setDirection(-1)
					newX = bounds.maxX
				} else if (newX <= bounds.minX) {
					setDirection(1)
					newX = bounds.minX
				}
				const newY = prev.y > 0 ? Math.max(0, prev.y - 0.5) : 0
				return { x: newX, y: newY }
			})
		} else if (action === 'climb' && behaviorState === 'climbing') {
			setPosition((prev) => {
				const bounds = getMovementBounds()
				let newY = prev.y + CLIMB_SPEED
				if (newY >= bounds.maxY) {
					newY = bounds.maxY
				}
				const wallX = direction === 1 ? bounds.maxX : bounds.minX
				return { x: wallX, y: newY }
			})
		} else if (behaviorState !== 'climbing' && position.y > 0) {
			setPosition((prev) => ({ ...prev, y: Math.max(0, prev.y - 1.5) }))
		}
	}, [
		action,
		behaviorState,
		direction,
		targetX,
		isMovingToTarget,
		getMovementBounds,
		getCurrentSpeed,
		updateBehavior,
	])

	useEffect(() => {
		const animationLoop = setInterval(physicsUpdate, 16)
		return () => clearInterval(animationLoop)
	}, [physicsUpdate])

	useEffect(() => {
		const container = containerRef.current
		if (container) {
			container.addEventListener('click', handleClick)
		}
		return () => {
			if (container) {
				container.removeEventListener('click', handleClick)
			}
		}
	}, [handleClick])

	const getGif = () => {
		switch (action) {
			case 'walk':
				return walking
			case 'run':
				return running
			case 'sit':
				return swipe
			case 'stand':
				return idle
			case 'climb':
				return walking
			case 'idle':
				return lie
			default:
				return idle
		}
	}

	return (
		<div ref={containerRef} className="absolute bottom-0 w-full h-full overflow-hidden">
			<div
				className="absolute transition-transform duration-300"
				style={{
					left: `${position.x}px`,
					bottom: `${position.y}px`,
					transform: `scaleX(${direction})`,
					width: `${DOG_SIZE}px`,
					height: `${DOG_SIZE}px`,
				}}
			>
				<img
					src={getGif()}
					alt="Interactive Dog"
					className="object-cover w-full h-full pointer-events-none"
				/>
			</div>
		</div>
	)
}
