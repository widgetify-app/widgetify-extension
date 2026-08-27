import { useCallback, useEffect, useRef, useState } from 'react'
import { PetTooltip } from '../components/pet-tooltip'
import { cn } from '@/common/utils/cn'
import {
	type CollectibleItem,
	type PetAnimations,
	type PetAssets,
	PetBehavior,
	type PetDimensions,
	type PetDurations,
	type Position,
} from './pet-types'

/** How fast a pet still airborne (e.g. mid-climb) settles back to the ground. */
const FALL_SPEED = 1.5

function randomDuration({ min, max }: { min: number; max: number }): number {
	return Math.floor(Math.random() * (max - min) + min)
}

export interface BasePetProps {
	name: string
	animations: PetAnimations
	dimensions: PetDimensions
	durations: PetDurations
	assets: PetAssets
	onCollectibleCollection: (collectedItemId: number) => void
	onLevelDownHungryState: () => void
	isHungry: boolean
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
						<div
							key={item.id}
							className="absolute"
							style={{
								left: `${item.x}px`,
								bottom: `${item.y}px`,
							}}
						>
							{CollectibleIcon}
						</div>
					)
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
	showName?: boolean
	collectibles: CollectibleItem[]
	getAnimationForCurrentAction: () => string
	dimensions: PetDimensions
	assets: PetAssets
	isHungry: boolean
	hungryLevel: number | undefined
	className?: string
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
	isHungry,
	className,
}) => {
	const showToolTip = showName || isHungry

	const currentSrc = getAnimationForCurrentAction()
	const [loadedSrcs, setLoadedSrcs] = useState<string[]>(() =>
		currentSrc ? [currentSrc] : []
	)

	useEffect(() => {
		if (!currentSrc) return
		setLoadedSrcs((prev) =>
			prev.includes(currentSrc) ? prev : [...prev, currentSrc]
		)
	}, [currentSrc])

	return (
		<div
			ref={containerRef}
			className={cn(
				'absolute hidden w-full h-16 overflow-hidden -bottom-2 md:flex',
				className
			)}
			style={{
				zIndex: 50,
				// margin: '8px',
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
					width: '50px',
					height: `${dimensions.size}px`,
					zIndex: 10,
				}}
			>
				{showToolTip && (
					<PetTooltip
						direction={direction}
						content={isHungry ? 'غذاااا بدهه' : name}
						emoji={isHungry ? '🍽️' : undefined}
						isAnimation={isHungry}
					/>
				)}
				{loadedSrcs.map((src) => (
					<img
						key={src}
						src={src}
						className="absolute inset-0 object-contain w-full h-full pointer-events-none"
						style={{ visibility: src === currentSrc ? 'visible' : 'hidden' }}
					/>
				))}
			</div>
		</div>
	)
}

export function useBasePetLogic({
	animations,
	dimensions,
	durations,
	assets,
	onCollectibleCollection,
	isHungry = false,
	onLevelDownHungryState,
}: BasePetProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const petRef = useRef<HTMLDivElement>(null)

	const [position, setPosition] = useState<Position>({ x: 30, y: 0 })
	const [direction, setDirection] = useState(1)
	const [action, setAction] = useState<keyof PetAnimations>('idle')
	const [actionTimer, setActionTimer] = useState(0)
	const [behaviorState, setBehaviorState] = useState<PetBehavior>(PetBehavior.RESTING)
	// Whether a climb is heading back down. Keeps the pet in the CLIMBING behavior
	// for the whole up-and-down trip so it never idles mid-air — see climbWall.
	const [isDescending, setIsDescending] = useState(false)
	const [targetX, setTargetX] = useState<number | null>(null)
	const [isMovingToTarget, setIsMovingToTarget] = useState(false)
	const [showName, setShowName] = useState(false)

	const [collectibles, setCollectibles] = useState<CollectibleItem[]>([])
	const [collectibleIdCounter, setCollectibleIdCounter] = useState(0)

	const getMovementBounds = useCallback(() => {
		const container = containerRef.current
		const visibleHeight = container?.offsetHeight ?? dimensions.maxHeight

		return {
			minX: 10,
			maxX: (container?.offsetWidth || 300) - dimensions.size - 10,
			minY: 0,
			// The container clips overflow (see BasePetContainer's h-16/h-8), which is
			// shorter than several pets' configured maxHeight (80-100px). Climbing past
			// it pushed pets above the visible area, so they'd reappear "floating" back
			// down into frame — clamp to whichever is actually smaller.
			maxY: Math.max(
				0,
				Math.min(dimensions.maxHeight, visibleHeight - dimensions.size)
			),
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
				if (collectibles.length > 2) {
					setCollectibles([])
					return
				}

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

				// Only force an immediate chase reaction while grounded. If the pet is
				// mid-climb, forcing 'run' here would move it horizontally while still
				// airborne (the same "flying" bug climbWall guards against) — let it
				// land first; updateBehavior picks up the waiting collectible on its own
				// the moment position.y reaches 0.
				if (position.y === 0) {
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
			}
		},
		[
			collectibleIdCounter,
			assets.collectibleSize,
			action,
			position.y,
			getMovementBounds,
			updateAction,
			updateBehaviorState,
		]
	)

	const findNearestCollectible = useCallback(
		(currentCollectibles: CollectibleItem[]) => {
			const availableCollectibles = currentCollectibles.filter(
				(item) => !item.collected && !item.dropping && item.y <= 5
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
		[position.x]
	)

	const handleCollectibleCollection = useCallback(
		(collectedItemId: number) => {
			setCollectibles((prevCollectibles) =>
				prevCollectibles.map((collectible) =>
					collectible.id === collectedItemId
						? { ...collectible, collected: true }
						: collectible
				)
			)
			updateAction('stand')
			if (onCollectibleCollection) {
				onCollectibleCollection(collectedItemId)
			}
			setTimeout(
				() =>
					updateAction(behaviorState === PetBehavior.CHASING ? 'run' : 'walk'),
				500
			)
		},
		[updateAction, behaviorState]
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
		// Always land before switching to anything else — never leave the pet
		// paused mid-climb. climbWall handles the actual descent and transitions
		// to RESTING itself once position.y reaches 0.
		if (behaviorState === PetBehavior.CLIMBING) {
			setIsDescending(true)
			return
		}

		if (isHungry) {
			updateBehaviorState(PetBehavior.RESTING)
			updateAction('sit')
			setActionTimer(randomDuration(durations.rest))
			return
		}

		const random = Math.random()
		if (behaviorState === PetBehavior.ROAMING) {
			if (isNearWall() && random > 0.7 && animations.climb) {
				setIsDescending(false)
				updateBehaviorState(PetBehavior.CLIMBING)
				updateAction('climb')
				setActionTimer(randomDuration(durations.climb))
			} else {
				updateBehaviorState(PetBehavior.RESTING)
				const shouldSit = Math.random() > 0.5 && animations.sit
				updateAction(shouldSit ? 'sit' : 'idle')
				setActionTimer(randomDuration(durations.rest))
			}
		} else {
			// Includes PetBehavior.RESTING or initial state
			updateBehaviorState(PetBehavior.ROAMING)
			const shouldRun = Math.random() > 0.6
			updateAction(shouldRun ? 'run' : 'walk')
			setActionTimer(randomDuration(shouldRun ? durations.run : durations.walk))
		}

		if (onLevelDownHungryState) {
			onLevelDownHungryState()
		}
	}, [
		behaviorState,
		isHungry,
		isNearWall,
		animations.climb,
		animations.sit,
		durations,
		updateAction,
		updateBehaviorState,
	])

	const updateBehavior = useCallback(() => {
		const nearestCollectible = findNearestCollectible(collectibles)

		// Only chase while grounded. Reacting to a collectible mid-climb used to
		// switch straight to 'run' and move horizontally while the pet was still
		// airborne — i.e. it would fly toward the treat. Once landed, this same
		// check runs again next tick and starts the chase normally.
		if (nearestCollectible && position.y === 0) {
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
		position.y,
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
			const newY =
				currentPosition.y > 0 ? Math.max(0, currentPosition.y - FALL_SPEED) : 0
			return { x: newX, y: newY }
		},
		[getMovementBounds, getCurrentSpeed]
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
		]
	)

	const climbWall = useCallback(
		(currentPosition: Position, currentDirection: number) => {
			const bounds = getMovementBounds()
			const wallX = currentDirection === 1 ? bounds.maxX : bounds.minX

			if (isDescending) {
				const newY = currentPosition.y - dimensions.climbSpeed
				if (newY <= 0) {
					// Landed. Hand off to the normal rest cycle here, at y=0, instead of
					// switching to an idle/stand pose earlier and leaving gravity to
					// trickle the position down separately — that gap is what made pets
					// (most visibly the dog) look like they were floating back to earth.
					setIsDescending(false)
					updateBehaviorState(PetBehavior.RESTING)
					updateAction(animations.stand ? 'stand' : 'idle')
					setActionTimer(randomDuration(durations.rest))
					return { x: wallX, y: 0 }
				}
				return { x: wallX, y: newY }
			}

			const newY = Math.min(currentPosition.y + dimensions.climbSpeed, bounds.maxY)
			return { x: wallX, y: newY }
		},
		[
			isDescending,
			dimensions.climbSpeed,
			durations.rest,
			animations.stand,
			getMovementBounds,
			updateBehaviorState,
			updateAction,
		]
	)

	/** Safety net for a pet ever left with y > 0 outside an active climb. */
	const applyGravity = useCallback((currentPosition: Position) => {
		if (currentPosition.y > 0) {
			return { ...currentPosition, y: Math.max(0, currentPosition.y - FALL_SPEED) }
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

	// physicsUpdate gets a new identity on almost every tick (it transitively
	// depends on position/behaviorState via updateBehavior/movePet/etc.), so an
	// effect keyed on it would tear down and recreate the timer ~60 times a
	// second. Keeping the latest version in a ref lets the loop itself mount
	// once. requestAnimationFrame also pauses automatically while the tab is
	// backgrounded, unlike setInterval.
	const physicsUpdateRef = useRef(physicsUpdate)
	physicsUpdateRef.current = physicsUpdate

	useEffect(() => {
		let frameId: number
		let lastTick = performance.now()

		const loop = (now: number) => {
			if (now - lastTick >= 16) {
				lastTick = now
				physicsUpdateRef.current()
			}
			frameId = requestAnimationFrame(loop)
		}

		frameId = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(frameId)
	}, [])

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
