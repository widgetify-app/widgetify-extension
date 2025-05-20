import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
	type CollectibleItem,
	type PetAnimations,
	type PetAssets,
	PetBehavior,
	type PetDimensions,
	type PetDurations,
	type Position,
} from './pet-types'

export interface BasePetProps {
	name: string
	animations: PetAnimations
	dimensions: PetDimensions
	durations: PetDurations
	assets: PetAssets
}

interface CollectiblesRendererProps {
	collectibles: CollectibleItem[]
	assets: PetAssets
}

export const CollectiblesRenderer: React.FC<CollectiblesRendererProps> = ({
	collectibles,
	assets,
}) => {
	const CollectibleIcon = assets.collectibleIcon

	return (
		<>
			{collectibles.map(
				(item) =>
					!item.collected && (
						<motion.div
							key={item.id}
							className="absolute"
							style={{
								left: `${item.x}px`,
								bottom: `${item.y}px`,
								width: `${assets.collectibleSize}px`,
								height: `${assets.collectibleSize}px`,
							}}
							animate={item.collected ? { scale: [1, 1.3, 0], opacity: [1, 0.8, 0] } : {}}
							transition={{ duration: 0.5 }}
						>
							<CollectibleIcon
								size={assets.collectibleSize}
								className={`text-${assets.collectibleColor || 'yellow-500'} drop-shadow-md ${item.dropping ? 'animate-bounce' : ''}`}
							/>
						</motion.div>
					),
			)}
		</>
	)
}

interface BasePetContainerProps {
	name: string
	containerRef: React.RefObject<HTMLDivElement | null>
	petRef: React.RefObject<HTMLDivElement | null>
	position: Position
	direction: number
	showName: boolean
	collectibles: CollectibleItem[]
	getAnimationForCurrentAction: () => string
	dimensions: PetDimensions
	assets: PetAssets
	altText?: string
}

export const BasePetContainer: React.FC<BasePetContainerProps> = ({
	name,
	containerRef,
	petRef,
	position,
	direction,
	showName,
	collectibles,
	getAnimationForCurrentAction,
	dimensions,
	assets,
	altText = 'Interactive Pet',
}) => {
	return (
		<div
			ref={containerRef}
			className="absolute hidden w-full overflow-hidden h-14 -bottom-2 lg:flex"
			style={{
				zIndex: 50,
			}}
		>
			<CollectiblesRenderer collectibles={collectibles} assets={assets} />

			<div
				ref={petRef}
				className="absolute transition-transform duration-300 cursor-pointer"
				style={{
					left: `${position.x}px`,
					bottom: `${position.y}px`,
					transform: `scaleX(${direction})`,
					width: `${dimensions.size}px`,
					height: `${dimensions.size}px`,
					zIndex: 10,
				}}
			>
				{showName && name && (
					<div
						className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/60 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap backdrop-blur-sm"
						style={{ transform: `scaleX(${direction})` }}
					>
						{name}
					</div>
				)}
				<img
					src={getAnimationForCurrentAction()}
					alt={altText}
					className="object-cover w-full h-full pointer-events-none"
				/>
			</div>
		</div>
	)
}

export function useBasePetLogic({
	name, // Added name to props to use in hook
	animations,
	dimensions,
	durations,
	assets,
}: BasePetProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const petRef = useRef<HTMLDivElement>(null)

	const [position, setPosition] = useState<Position>({ x: 30, y: 0 })
	const [direction, setDirection] = useState(1)
	const [action, setAction] = useState<keyof PetAnimations>('idle')
	const [actionTimer, setActionTimer] = useState(0)
	const [behaviorState, setBehaviorState] = useState<PetBehavior>(PetBehavior.RESTING)
	const [targetX, setTargetX] = useState<number | null>(null)
	const [isMovingToTarget, setIsMovingToTarget] = useState(false)
	const [showName, setShowName] = useState(false)

	const [collectibles, setCollectibles] = useState<CollectibleItem[]>([])
	const [collectibleIdCounter, setCollectibleIdCounter] = useState(0)

	const getMovementBounds = useCallback(() => {
		const container = containerRef.current
		return {
			minX: 10,
			maxX: (container?.offsetWidth || 300) - dimensions.size - 10,
			minY: 0,
			maxY: dimensions.maxHeight,
		}
	}, [dimensions.size, dimensions.maxHeight])

	const isNearWall = useCallback(() => {
		const bounds = getMovementBounds()
		return position.x <= bounds.minX + 5 || position.x >= bounds.maxX - 5
	}, [getMovementBounds, position.x])

	const getCurrentSpeed = useCallback(() => {
		return action === 'run' ? dimensions.runSpeed : dimensions.walkSpeed
	}, [action, dimensions.runSpeed, dimensions.walkSpeed])

	const updateAction = useCallback((newAction: keyof PetAnimations) => {
		setAction((currentAction) => {
			if (currentAction !== newAction) {
				return newAction
			}
			return currentAction
		})
	}, [])

	const updateBehaviorState = useCallback((newBehaviorState: PetBehavior) => {
		setBehaviorState((currentBehaviorState) => {
			if (currentBehaviorState !== newBehaviorState) {
				return newBehaviorState
			}
			return currentBehaviorState
		})
	}, [])

	const handleClick = useCallback(
		(e: MouseEvent) => {
			const container = containerRef.current
			if (container) {
				const rect = container.getBoundingClientRect()
				const clickX = e.clientX - rect.left
				const bounds = getMovementBounds()
				const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, clickX))

				const newCollectible: CollectibleItem = {
					id: collectibleIdCounter,
					x: clampedX,
					y: -assets.collectibleSize,
					collected: false,
					dropping: true,
				}

				setCollectibles((prev) => [...prev, newCollectible])
				setCollectibleIdCounter((prev) => prev + 1)

				if (action === 'sit' || action === 'idle') {
					updateAction('stand')
					setTimeout(() => {
						updateAction('run')
						updateBehaviorState(PetBehavior.CHASING)
					}, 300)
				} else {
					updateAction('run')
					updateBehaviorState(PetBehavior.CHASING)
				}
			}
		},
		[
			collectibleIdCounter,
			assets.collectibleSize,
			action,
			getMovementBounds,
			updateAction,
			updateBehaviorState,
		],
	)

	const findNearestCollectible = useCallback(
		(currentCollectibles: CollectibleItem[]) => {
			const availableCollectibles = currentCollectibles.filter(
				(item) => !item.collected && !item.dropping && item.y <= 5,
			)

			if (availableCollectibles.length === 0) return null

			let nearest = availableCollectibles[0]
			let minDistance = Math.abs(position.x - nearest.x)

			for (let i = 1; i < availableCollectibles.length; i++) {
				const distance = Math.abs(position.x - availableCollectibles[i].x)
				if (distance < minDistance) {
					minDistance = distance
					nearest = availableCollectibles[i]
				}
			}
			return nearest
		},
		[position.x],
	)

	const handleCollectibleCollection = useCallback(
		(collectedItemId: number) => {
			setCollectibles((prevCollectibles) =>
				prevCollectibles.map((collectible) =>
					collectible.id === collectedItemId
						? { ...collectible, collected: true }
						: collectible,
				),
			)
			updateAction('stand')
			setTimeout(
				() => updateAction(behaviorState === PetBehavior.CHASING ? 'run' : 'walk'),
				500,
			)
		},
		[updateAction, behaviorState],
	)

	const updateCollectibles = useCallback(() => {
		setCollectibles((prevCollectibles) => {
			let collectiblesChanged = false
			const updatedCollectibles = prevCollectibles.map((collectible) => {
				if (collectible.collected) return collectible

				if (collectible.dropping) {
					const newY = collectible.y + assets.collectibleFallSpeed
					if (newY >= 0) {
						collectiblesChanged = true
						return { ...collectible, y: 0, dropping: false }
					}
					collectiblesChanged = true
					return { ...collectible, y: newY }
				}

				const distance = Math.abs(collectible.x - position.x)
				if (
					!collectible.collected &&
					!collectible.dropping &&
					distance < dimensions.size / 1.5
				) {
					handleCollectibleCollection(collectible.id)
					// The actual collection marking will be handled by handleCollectibleCollection's setCollectibles
					// We return the original collectible here to avoid immediate re-render issues before the state update from handleCollectibleCollection
					return collectible
				}
				return collectible
			})

			if (collectiblesChanged) {
				return updatedCollectibles
			}
			return prevCollectibles
		})
	}, [
		assets.collectibleFallSpeed,
		position.x,
		dimensions.size,
		handleCollectibleCollection,
	])

	// Effect for removing collected items after a delay
	useEffect(() => {
		const collectedItems = collectibles.filter((c) => c.collected)
		if (collectedItems.length > 0) {
			const timer = setTimeout(() => {
				setCollectibles((prev) => prev.filter((c) => !c.collected))
			}, 2000) // Delay before removing
			return () => clearTimeout(timer)
		}
	}, [collectibles])

	const roamOrRest = useCallback(() => {
		const random = Math.random()
		if (behaviorState === PetBehavior.ROAMING) {
			if (isNearWall() && random > 0.7 && animations.climb) {
				updateBehaviorState(PetBehavior.CLIMBING)
				updateAction('climb')
				setActionTimer(
					Math.floor(
						Math.random() * (durations.climb.max - durations.climb.min) +
							durations.climb.min,
					),
				)
			} else {
				updateBehaviorState(PetBehavior.RESTING)
				const shouldSit = Math.random() > 0.5 && animations.sit
				updateAction(shouldSit ? 'sit' : 'idle')
				setActionTimer(
					Math.floor(
						Math.random() * (durations.rest.max - durations.rest.min) +
							durations.rest.min,
					),
				)
			}
		} else if (behaviorState === PetBehavior.CLIMBING) {
			updateBehaviorState(PetBehavior.RESTING)
			updateAction(animations.stand ? 'stand' : 'idle')
			setActionTimer(
				Math.floor(
					Math.random() * (durations.rest.max - durations.rest.min) + durations.rest.min,
				),
			)
		} else {
			// Includes PetBehavior.RESTING or initial state
			updateBehaviorState(PetBehavior.ROAMING)
			const shouldRun = Math.random() > 0.6
			updateAction(shouldRun ? 'run' : 'walk')
			setActionTimer(
				Math.floor(
					Math.random() *
						(shouldRun
							? durations.run.max - durations.run.min + durations.run.min
							: durations.walk.max - durations.walk.min + durations.walk.min),
				),
			)
		}
	}, [
		behaviorState,
		isNearWall,
		animations.climb,
		animations.sit,
		animations.stand,
		durations,
		updateAction,
		updateBehaviorState,
	])

	const updateBehavior = useCallback(() => {
		const nearestCollectible = findNearestCollectible(collectibles)

		if (nearestCollectible) {
			if (behaviorState !== PetBehavior.CHASING) {
				updateBehaviorState(PetBehavior.CHASING)
				updateAction('run')
			}
			setTargetX(nearestCollectible.x)
			setIsMovingToTarget(true)
			return
		}

		// If was chasing but no more collectibles, rest
		if (behaviorState === PetBehavior.CHASING) {
			updateBehaviorState(PetBehavior.RESTING)
			updateAction('idle')
			setActionTimer(2000) // Rest for 2 seconds
			setIsMovingToTarget(false) // Stop chasing
			setTargetX(null)
			return
		}

		if (!isMovingToTarget && actionTimer <= 0) {
			roamOrRest()
		} else if (!isMovingToTarget) {
			setActionTimer((prev) => prev - 16) // Using 16ms interval from physicsUpdate
		}
	}, [
		collectibles,
		findNearestCollectible,
		behaviorState,
		isMovingToTarget,
		actionTimer,
		updateAction,
		updateBehaviorState,
		roamOrRest,
	])

	const movePet = useCallback(
		(currentPosition: Position, currentDirection: number) => {
			const bounds = getMovementBounds()
			let newX = currentPosition.x + currentDirection * getCurrentSpeed()
			let newDirection = currentDirection

			if (newX >= bounds.maxX) {
				newDirection = -1
				newX = bounds.maxX
			} else if (newX <= bounds.minX) {
				newDirection = 1
				newX = bounds.minX
			}
			if (newDirection !== currentDirection) {
				setDirection(newDirection)
			}
			const newY = currentPosition.y > 0 ? Math.max(0, currentPosition.y - 0.5) : 0
			return { x: newX, y: newY }
		},
		[getMovementBounds, getCurrentSpeed],
	)

	const moveToTarget = useCallback(
		(currentPosition: Position) => {
			if (targetX === null) return currentPosition // Should not happen if isMovingToTarget is true

			const bounds = getMovementBounds()
			const delta = targetX - currentPosition.x
			const distance = Math.abs(delta)
			const speed = action === 'run' ? dimensions.runSpeed : dimensions.walkSpeed

			if (distance <= speed) {
				setIsMovingToTarget(false)
				setTargetX(null)
				// After reaching target, decide next action based on behavior
				if (behaviorState === PetBehavior.CHASING) {
					const nextCollectible = findNearestCollectible(collectibles)
					if (!nextCollectible) {
						updateAction('idle') // No more collectibles to chase
						updateBehaviorState(PetBehavior.RESTING)
					} else {
						// If there's another collectible, updateBehavior will handle it in the next tick
					}
				} else {
					updateAction('idle') // Default to idle if not chasing
				}
				return { x: targetX, y: currentPosition.y }
			}

			const newDirection = delta > 0 ? 1 : -1
			if (newDirection !== direction) {
				setDirection(newDirection)
			}

			const newX = currentPosition.x + newDirection * speed
			return {
				x: Math.max(bounds.minX, Math.min(bounds.maxX, newX)),
				y: currentPosition.y,
			}
		},
		[
			targetX,
			action,
			dimensions.runSpeed,
			dimensions.walkSpeed,
			behaviorState,
			collectibles,
			direction,
			getMovementBounds,
			findNearestCollectible,
			updateAction,
			updateBehaviorState,
		],
	)

	const climbWall = useCallback(
		(currentPosition: Position, currentDirection: number) => {
			const bounds = getMovementBounds()
			let newY = currentPosition.y + dimensions.climbSpeed
			if (newY >= bounds.maxY) {
				newY = bounds.maxY
				// Optionally, transition to another state once max height is reached
				// updateBehaviorState(PetBehavior.RESTING);
				// updateAction('idle');
			}
			const wallX = currentDirection === 1 ? bounds.maxX : bounds.minX
			return { x: wallX, y: newY }
		},
		[dimensions.climbSpeed, dimensions.maxHeight, getMovementBounds],
	)

	const applyGravity = useCallback((currentPosition: Position) => {
		if (currentPosition.y > 0) {
			return { ...currentPosition, y: Math.max(0, currentPosition.y - 1.5) }
		}
		return currentPosition
	}, [])

	const physicsUpdate = useCallback(() => {
		updateCollectibles()
		updateBehavior()

		setPosition((prevPosition) => {
			let newPosition = { ...prevPosition }

			if (isMovingToTarget && (action === 'walk' || action === 'run')) {
				newPosition = moveToTarget(prevPosition)
			} else if (action === 'walk' || action === 'run') {
				newPosition = movePet(prevPosition, direction)
			} else if (
				action === 'climb' &&
				behaviorState === PetBehavior.CLIMBING &&
				animations.climb
			) {
				newPosition = climbWall(prevPosition, direction)
			} else if (behaviorState !== PetBehavior.CLIMBING && prevPosition.y > 0) {
				newPosition = applyGravity(prevPosition)
			}
			return newPosition
		})
	}, [
		updateCollectibles,
		updateBehavior,
		isMovingToTarget,
		action,
		moveToTarget,
		movePet,
		direction,
		behaviorState,
		animations.climb,
		climbWall,
		applyGravity,
	])

	useEffect(() => {
		const animationLoop = setInterval(physicsUpdate, 16) // Approx 60 FPS
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

	useEffect(() => {
		const petElement = petRef.current
		if (!petElement) return

		const handleMouseEnter = () => {
			setShowName(true)
		}

		const handleMouseLeave = () => {
			setShowName(false)
		}

		petElement.addEventListener('mouseenter', handleMouseEnter)
		petElement.addEventListener('mouseleave', handleMouseLeave)

		return () => {
			petElement.removeEventListener('mouseenter', handleMouseEnter)
			petElement.removeEventListener('mouseleave', handleMouseLeave)
		}
	}, [petRef]) // Added petRef to dependency array

	const getAnimationForCurrentAction = useCallback(() => {
		return animations[action] || animations.idle
	}, [animations, action])

	return {
		containerRef,
		petRef,
		position,
		direction,
		action,
		showName,
		collectibles,
		getAnimationForCurrentAction,
		dimensions,
		assets,
	}
}
