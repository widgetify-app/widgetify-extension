import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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
			className="absolute hidden w-full h-32 overflow-hidden -bottom-3 lg:flex"
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

	const getMovementBounds = () => {
		const container = containerRef.current
		return {
			minX: 10,
			maxX: (container?.offsetWidth || 300) - dimensions.size - 10,
			minY: 0,
			maxY: dimensions.maxHeight,
		}
	}

	const isNearWall = () => {
		const bounds = getMovementBounds()
		return position.x <= bounds.minX + 5 || position.x >= bounds.maxX - 5
	}

	const getCurrentSpeed = () => {
		return action === 'run' ? dimensions.runSpeed : dimensions.walkSpeed
	}

	const handleClick = (e: MouseEvent) => {
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
				setAction('stand')
				setTimeout(() => {
					setAction('run')
					setBehaviorState(PetBehavior.CHASING)
				}, 300)
			} else {
				setAction('run')
				setBehaviorState(PetBehavior.CHASING)
			}
		}
	}

	const findNearestCollectible = () => {
		const availableCollectibles = collectibles.filter(
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
	}

	const updateBehavior = () => {
		const nearestCollectible = findNearestCollectible()

		if (nearestCollectible) {
			if (behaviorState !== PetBehavior.CHASING) {
				setBehaviorState(PetBehavior.CHASING)
				setAction('run')
			}

			setTargetX(nearestCollectible.x)
			setIsMovingToTarget(true)
			return
		}

		if (!isMovingToTarget && actionTimer <= 0) {
			const random = Math.random()

			if (behaviorState === PetBehavior.ROAMING) {
				if (isNearWall() && random > 0.7) {
					setBehaviorState(PetBehavior.CLIMBING)
					setAction('climb')
					setActionTimer(
						Math.floor(
							Math.random() * (durations.climb.max - durations.climb.min) +
								durations.climb.min,
						),
					)
				} else {
					setBehaviorState(PetBehavior.RESTING)
					const shouldSit = Math.random() > 0.5
					setAction(shouldSit ? 'sit' : 'idle')
					setActionTimer(
						Math.floor(
							Math.random() * (durations.rest.max - durations.rest.min) +
								durations.rest.min,
						),
					)
				}
			} else if (behaviorState === PetBehavior.CLIMBING) {
				setBehaviorState(PetBehavior.RESTING)
				setAction('stand')
				setActionTimer(
					Math.floor(
						Math.random() * (durations.rest.max - durations.rest.min) +
							durations.rest.min,
					),
				)
			} else if (behaviorState === PetBehavior.CHASING && !nearestCollectible) {
				setBehaviorState(PetBehavior.RESTING)
				setAction('idle')
				setActionTimer(2000)
			} else {
				setBehaviorState(PetBehavior.ROAMING)
				const shouldRun = Math.random() > 0.6
				setAction(shouldRun ? 'run' : 'walk')
				setActionTimer(
					Math.floor(
						Math.random() *
							(shouldRun
								? durations.run.max - durations.run.min + durations.run.min
								: durations.walk.max - durations.walk.min + durations.walk.min),
					),
				)
			}
		} else if (!isMovingToTarget) {
			setActionTimer((prev) => prev - 16)
		}
	}

	const physicsUpdate = () => {
		setCollectibles((prevCollectibles) =>
			prevCollectibles.map((collectible) => {
				if (collectible.collected) return collectible

				if (collectible.dropping) {
					const newY = collectible.y + assets.collectibleFallSpeed

					if (newY >= 0) {
						return { ...collectible, y: 0, dropping: false }
					}
					return { ...collectible, y: newY }
				}

				const distance = Math.abs(collectible.x - position.x)
				if (
					!collectible.collected &&
					!collectible.dropping &&
					distance < dimensions.size / 1.5
				) {
					setAction('stand')
					setTimeout(
						() => setAction(behaviorState === PetBehavior.CHASING ? 'run' : 'walk'),
						500,
					)

					return { ...collectible, collected: true }
				}

				return collectible
			}),
		)

		if (collectibles.some((b) => b.collected)) {
			setTimeout(() => {
				setCollectibles((prev) => prev.filter((b) => !b.collected))
			}, 2000)
		}

		updateBehavior()

		if (isMovingToTarget && targetX !== null && (action === 'walk' || action === 'run')) {
			setPosition((prev) => {
				const bounds = getMovementBounds()
				const delta = targetX - prev.x
				const distance = Math.abs(delta)
				const speed = action === 'run' ? dimensions.runSpeed : dimensions.walkSpeed

				if (distance <= speed) {
					setIsMovingToTarget(false)
					setTargetX(null)
					if (behaviorState === PetBehavior.CHASING) {
						const nextCollectible = findNearestCollectible()
						if (!nextCollectible) {
							setAction('idle')
						}
					} else {
						setAction('idle')
					}
					return { x: targetX, y: prev.y }
				}

				const newDirection = delta > 0 ? 1 : -1
				setDirection(newDirection)

				const newX = prev.x + newDirection * speed

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
		} else if (action === 'climb' && behaviorState === PetBehavior.CLIMBING) {
			setPosition((prev) => {
				const bounds = getMovementBounds()
				let newY = prev.y + dimensions.climbSpeed
				if (newY >= bounds.maxY) {
					newY = bounds.maxY
				}
				const wallX = direction === 1 ? bounds.maxX : bounds.minX
				return { x: wallX, y: newY }
			})
		} else if (behaviorState !== PetBehavior.CLIMBING && position.y > 0) {
			setPosition((prev) => ({ ...prev, y: Math.max(0, prev.y - 1.5) }))
		}
	}

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

	useEffect(() => {
		const petElement = petRef.current

		const handleMouseEnter = () => {
			setShowName(true)
		}

		const handleMouseLeave = () => {
			setShowName(false)
		}

		if (petElement) {
			petElement.addEventListener('mouseenter', handleMouseEnter)
			petElement.addEventListener('mouseleave', handleMouseLeave)
		}

		return () => {
			if (petElement) {
				petElement.removeEventListener('mouseenter', handleMouseEnter)
				petElement.removeEventListener('mouseleave', handleMouseLeave)
			}
		}
	}, [])

	const getAnimationForCurrentAction = () => {
		return animations[action] || animations.idle
	}

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
