import { useCallback, useEffect, useRef, useState } from 'react'
import { PetTooltip } from '../components/pet-tooltip'
import { cn } from '@/common/utils/cn'
import {
	clampToBounds,
	directionTowardWall,
	frameScale,
	getMovementBounds,
	isNearWall,
	pickClimbWall,
	stepWalk,
} from './pet-movement'
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
					width: `${dimensions.width}px`,
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
						placement={position.y > 0 ? 'bottom' : 'top'}
					/>
				)}
				{loadedSrcs.map((src) => (
					<img
						key={src}
						src={src}
						alt={name}
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

	const [isDescending, setIsDescending] = useState(false)
	const [targetX, setTargetX] = useState<number | null>(null)
	const [isMovingToTarget, setIsMovingToTarget] = useState(false)
	const [showName, setShowName] = useState(false)

	const [collectibles, setCollectibles] = useState<CollectibleItem[]>([])

	const positionRef = useRef<Position>({ x: 30, y: 0 })
	const collectiblesRef = useRef<CollectibleItem[]>([])
	const collectibleIdRef = useRef(0)
	const climbWallXRef = useRef<number | null>(null)
	const behaviorStateRef = useRef(behaviorState)
	const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
	const onCollectibleCollectionRef = useRef(onCollectibleCollection)
	const onLevelDownHungryStateRef = useRef(onLevelDownHungryState)

	onCollectibleCollectionRef.current = onCollectibleCollection
	onLevelDownHungryStateRef.current = onLevelDownHungryState
	behaviorStateRef.current = behaviorState

	const scheduleTimeout = useCallback((callback: () => void, delay: number) => {
		const id = setTimeout(() => {
			timeoutsRef.current.delete(id)
			callback()
		}, delay)
		timeoutsRef.current.add(id)
		return id
	}, [])

	useEffect(() => {
		const timeouts = timeoutsRef.current
		return () => {
			for (const id of timeouts) {
				clearTimeout(id)
			}
			timeouts.clear()
		}
	}, [])

	const applyCollectibles = useCallback((next: CollectibleItem[]) => {
		collectiblesRef.current = next
		setCollectibles(next)
	}, [])

	const applyPosition = useCallback((next: Position) => {
		const prev = positionRef.current
		if (prev.x === next.x && prev.y === next.y) return
		positionRef.current = next
		setPosition(next)
	}, [])

	const getBounds = useCallback(() => {
		const container = containerRef.current
		return getMovementBounds(
			container?.offsetWidth || 0,
			container?.offsetHeight || 0,
			dimensions.width,
			dimensions.size,
			dimensions.maxHeight
		)
	}, [dimensions.width, dimensions.size, dimensions.maxHeight])

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
			if (!container) return

			if (collectiblesRef.current.length > 2) {
				applyCollectibles([])
				return
			}

			const rect = container.getBoundingClientRect()
			const clickX = e.clientX - rect.left
			const bounds = getBounds()
			const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, clickX))
			const spawnY = Math.max(
				0,
				(container.offsetHeight || 0) - assets.collectibleSize
			)

			const newCollectible: CollectibleItem = {
				id: collectibleIdRef.current,
				x: clampedX,
				y: spawnY,
				collected: false,
				dropping: true,
			}
			collectibleIdRef.current += 1

			applyCollectibles([...collectiblesRef.current, newCollectible])

			if (positionRef.current.y === 0) {
				if (action === 'sit' || action === 'idle') {
					updateAction('stand')
					scheduleTimeout(() => {
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
			assets.collectibleSize,
			action,
			getBounds,
			updateAction,
			updateBehaviorState,
			applyCollectibles,
			scheduleTimeout,
		]
	)

	const findNearestCollectible = useCallback(
		(currentCollectibles: CollectibleItem[]) => {
			const availableCollectibles = currentCollectibles.filter(
				(item) => !item.collected && !item.dropping && item.y <= 5
			)

			if (availableCollectibles.length === 0) return null

			const currentX = positionRef.current.x
			let nearest = availableCollectibles[0]
			let minDistance = Math.abs(currentX - nearest.x)

			for (let i = 1; i < availableCollectibles.length; i++) {
				const distance = Math.abs(currentX - availableCollectibles[i].x)
				if (distance < minDistance) {
					minDistance = distance
					nearest = availableCollectibles[i]
				}
			}
			return nearest
		},
		[]
	)

	const handleCollectibleCollection = useCallback(
		(collectedItemId: number) => {
			updateAction('stand')
			onCollectibleCollectionRef.current?.(collectedItemId)
			scheduleTimeout(
				() =>
					updateAction(
						behaviorStateRef.current === PetBehavior.CHASING ? 'run' : 'walk'
					),
				500
			)
		},
		[updateAction, scheduleTimeout]
	)

	const updateCollectibles = useCallback(
		(scale: number) => {
			const prevCollectibles = collectiblesRef.current
			if (prevCollectibles.length === 0) return

			const fallStep = assets.collectibleFallSpeed * scale
			const currentX = positionRef.current.x
			const collectRadius = dimensions.size / 1.5

			let changed = false
			let collectedId: number | null = null

			const updatedCollectibles = prevCollectibles.map((collectible) => {
				if (collectible.collected) return collectible

				if (collectible.dropping) {
					changed = true
					const newY = collectible.y - fallStep
					if (newY <= 0) {
						return { ...collectible, y: 0, dropping: false }
					}
					return { ...collectible, y: newY }
				}

				if (collectedId === null) {
					const distance = Math.abs(collectible.x - currentX)
					if (distance < collectRadius) {
						collectedId = collectible.id
						changed = true
						return { ...collectible, collected: true }
					}
				}

				return collectible
			})

			if (changed) {
				applyCollectibles(updatedCollectibles)
			}

			if (collectedId !== null) {
				handleCollectibleCollection(collectedId)
			}
		},
		[
			assets.collectibleFallSpeed,
			dimensions.size,
			applyCollectibles,
			handleCollectibleCollection,
		]
	)

	useEffect(() => {
		const collectedItems = collectibles.filter((c) => c.collected)
		if (collectedItems.length > 0) {
			const timer = setTimeout(() => {
				applyCollectibles(collectiblesRef.current.filter((c) => !c.collected))
			}, 2000)
			return () => clearTimeout(timer)
		}
	}, [collectibles, applyCollectibles])

	const startClimb = useCallback(() => {
		const bounds = getBounds()
		const wallX = pickClimbWall(positionRef.current.x, bounds)

		climbWallXRef.current = wallX
		setDirection(directionTowardWall(wallX, bounds))
		setIsDescending(false)
		updateBehaviorState(PetBehavior.CLIMBING)
		updateAction('climb')
		setActionTimer(randomDuration(durations.climb))
	}, [getBounds, updateAction, updateBehaviorState, durations.climb])

	const roamOrRest = useCallback(() => {
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
			const bounds = getBounds()
			if (isNearWall(positionRef.current.x, bounds) && random > 0.7 && animations.climb) {
				startClimb()
			} else {
				updateBehaviorState(PetBehavior.RESTING)
				const shouldSit = Math.random() > 0.5 && animations.sit
				updateAction(shouldSit ? 'sit' : 'idle')
				setActionTimer(randomDuration(durations.rest))
			}
		} else {
			updateBehaviorState(PetBehavior.ROAMING)
			const shouldRun = Math.random() > 0.6
			updateAction(shouldRun ? 'run' : 'walk')
			setActionTimer(randomDuration(shouldRun ? durations.run : durations.walk))
		}

		onLevelDownHungryStateRef.current?.()
	}, [
		behaviorState,
		isHungry,
		getBounds,
		startClimb,
		animations.climb,
		animations.sit,
		durations,
		updateAction,
		updateBehaviorState,
	])

	const updateBehavior = useCallback(
		(elapsed: number) => {
			const nearestCollectible = findNearestCollectible(collectiblesRef.current)

			if (nearestCollectible && positionRef.current.y === 0) {
				if (behaviorState !== PetBehavior.CHASING) {
					updateBehaviorState(PetBehavior.CHASING)
					updateAction('run')
				}
				setTargetX(nearestCollectible.x)
				setIsMovingToTarget(true)
				return
			}

			if (behaviorState === PetBehavior.CHASING) {
				updateBehaviorState(PetBehavior.RESTING)
				updateAction('idle')
				setActionTimer(2000)
				setIsMovingToTarget(false)
				setTargetX(null)
				return
			}

			if (!isMovingToTarget && actionTimer <= 0) {
				roamOrRest()
			} else if (!isMovingToTarget) {
				setActionTimer((prev) => prev - elapsed)
			}
		},
		[
			findNearestCollectible,
			behaviorState,
			isMovingToTarget,
			actionTimer,
			updateAction,
			updateBehaviorState,
			roamOrRest,
		]
	)

	const movePet = useCallback(
		(currentPosition: Position, currentDirection: number, scale: number) => {
			const bounds = getBounds()
			const result = stepWalk(
				currentPosition,
				currentDirection,
				getCurrentSpeed() * scale,
				FALL_SPEED * scale,
				bounds
			)

			if (result.direction !== currentDirection) {
				setDirection(result.direction)
			}

			return result.position
		},
		[getBounds, getCurrentSpeed]
	)

	const moveToTarget = useCallback(
		(currentPosition: Position, scale: number) => {
			if (targetX === null) return currentPosition

			const bounds = getBounds()
			const delta = targetX - currentPosition.x
			const distance = Math.abs(delta)
			const speed =
				(action === 'run' ? dimensions.runSpeed : dimensions.walkSpeed) * scale

			if (distance <= speed) {
				setIsMovingToTarget(false)
				setTargetX(null)

				if (behaviorState === PetBehavior.CHASING) {
					const nextCollectible = findNearestCollectible(collectiblesRef.current)
					if (!nextCollectible) {
						updateAction('idle')
						updateBehaviorState(PetBehavior.RESTING)
					}
				} else {
					updateAction('idle')
				}

				return clampToBounds({ x: targetX, y: currentPosition.y }, bounds)
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
			direction,
			getBounds,
			findNearestCollectible,
			updateAction,
			updateBehaviorState,
		]
	)

	const climbWall = useCallback(
		(currentPosition: Position, scale: number) => {
			const bounds = getBounds()
			const wallX =
				climbWallXRef.current ?? pickClimbWall(currentPosition.x, bounds)
			const climbStep = dimensions.climbSpeed * scale

			if (isDescending) {
				const newY = currentPosition.y - climbStep
				if (newY <= 0) {
					climbWallXRef.current = null
					setIsDescending(false)
					updateBehaviorState(PetBehavior.RESTING)
					updateAction(animations.stand ? 'stand' : 'idle')
					setActionTimer(randomDuration(durations.rest))
					return { x: wallX, y: 0 }
				}
				return { x: wallX, y: newY }
			}

			const newY = Math.min(currentPosition.y + climbStep, bounds.maxY)
			return { x: wallX, y: newY }
		},
		[
			isDescending,
			dimensions.climbSpeed,
			durations.rest,
			animations.stand,
			getBounds,
			updateBehaviorState,
			updateAction,
		]
	)

	/** Safety net for a pet ever left with y > 0 outside an active climb. */
	const applyGravity = useCallback((currentPosition: Position, scale: number) => {
		if (currentPosition.y > 0) {
			return {
				...currentPosition,
				y: Math.max(0, currentPosition.y - FALL_SPEED * scale),
			}
		}
		return currentPosition
	}, [])

	const physicsUpdate = useCallback(
		(elapsed: number) => {
			const scale = frameScale(elapsed)

			updateCollectibles(scale)
			updateBehavior(elapsed)

			const prevPosition = positionRef.current
			let newPosition = prevPosition

			if (isMovingToTarget && (action === 'walk' || action === 'run')) {
				newPosition = moveToTarget(prevPosition, scale)
			} else if (action === 'walk' || action === 'run') {
				newPosition = movePet(prevPosition, direction, scale)
			} else if (
				action === 'climb' &&
				behaviorState === PetBehavior.CLIMBING &&
				animations.climb
			) {
				newPosition = climbWall(prevPosition, scale)
			} else if (behaviorState !== PetBehavior.CLIMBING && prevPosition.y > 0) {
				newPosition = applyGravity(prevPosition, scale)
			}

			applyPosition(newPosition)
		},
		[
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
			applyPosition,
		]
	)

	const physicsUpdateRef = useRef(physicsUpdate)
	physicsUpdateRef.current = physicsUpdate

	useEffect(() => {
		let frameId: number
		let lastTick = performance.now()

		const loop = (now: number) => {
			const elapsed = now - lastTick
			if (elapsed >= 16) {
				lastTick = now
				physicsUpdateRef.current(elapsed)
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
	}, [petRef])

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
