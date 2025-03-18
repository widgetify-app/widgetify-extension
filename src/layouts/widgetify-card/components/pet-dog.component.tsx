import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LuBone } from 'react-icons/lu'
import idle from '@/assets/animals/akita_idle_8fps.gif'
import lie from '@/assets/animals/akita_lie_8fps.gif'
import running from '@/assets/animals/akita_run_8fps.gif'
import swipe from '@/assets/animals/akita_swipe_8fps.gif'
import walking from '@/assets/animals/akita_walk_fast_8fps.gif'
import { useGeneralSetting } from '@/context/general-setting.context'

interface Bone {
	id: number
	x: number
	y: number
	collected: boolean
	dropping: boolean
}

export const DogComponent = () => {
	const { petName } = useGeneralSetting()
	const containerRef = useRef<HTMLDivElement>(null)
	const dogRef = useRef<HTMLDivElement>(null)
	const [position, setPosition] = useState({ x: 30, y: 0 })
	const [direction, setDirection] = useState(1)
	const [action, setAction] = useState<
		'idle' | 'walk' | 'run' | 'sit' | 'stand' | 'climb'
	>('idle')
	const [actionTimer, setActionTimer] = useState(0)
	const [behaviorState, setBehaviorState] = useState<
		'roaming' | 'resting' | 'climbing' | 'chasing'
	>('resting')
	const [targetX, setTargetX] = useState<number | null>(null)
	const [isMovingToTarget, setIsMovingToTarget] = useState(false)
	const [showName, setShowName] = useState(false)

	const [bones, setBones] = useState<Bone[]>([])
	const [boneIdCounter, setBoneIdCounter] = useState(0)

	const DOG_SIZE = 32
	const WALK_SPEED = 1.8
	const RUN_SPEED = 3.5
	const CLIMB_SPEED = 1.2
	const MAX_HEIGHT = 100
	const BONE_FALL_SPEED = 2
	const BONE_SIZE = 24

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

				const newBone: Bone = {
					id: boneIdCounter,
					x: clampedX,
					y: -BONE_SIZE,
					collected: false,
					dropping: true,
				}

				setBones((prev) => [...prev, newBone])
				setBoneIdCounter((prev) => prev + 1)

				if (action === 'sit' || action === 'idle') {
					setAction('stand')
					setTimeout(() => {
						setAction('run')
						setBehaviorState('chasing')
					}, 300)
				} else {
					setAction('run')
					setBehaviorState('chasing')
				}
			}
		},
		[action, getMovementBounds, boneIdCounter],
	)

	const findNearestBone = useCallback(() => {
		const availableBones = bones.filter(
			(bone) => !bone.collected && !bone.dropping && bone.y <= 5,
		)

		if (availableBones.length === 0) return null

		let nearest = availableBones[0]
		let minDistance = Math.abs(position.x - nearest.x)

		for (let i = 1; i < availableBones.length; i++) {
			const distance = Math.abs(position.x - availableBones[i].x)
			if (distance < minDistance) {
				minDistance = distance
				nearest = availableBones[i]
			}
		}

		return nearest
	}, [bones, position.x])

	const updateBehavior = useCallback(() => {
		const nearestBone = findNearestBone()

		if (nearestBone) {
			if (behaviorState !== 'chasing') {
				setBehaviorState('chasing')
				setAction('run')
			}

			setTargetX(nearestBone.x)
			setIsMovingToTarget(true)
			return
		}

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
			} else if (behaviorState === 'chasing' && !nearestBone) {
				setBehaviorState('resting')
				setAction('idle')
				setActionTimer(2000)
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
	}, [actionTimer, behaviorState, isNearWall, isMovingToTarget, findNearestBone])

	const physicsUpdate = useCallback(() => {
		setBones((prevBones) =>
			prevBones.map((bone) => {
				if (bone.collected) return bone

				if (bone.dropping) {
					const newY = bone.y + BONE_FALL_SPEED

					if (newY >= 0) {
						return { ...bone, y: 0, dropping: false }
					}
					return { ...bone, y: newY }
				}

				const distance = Math.abs(bone.x - position.x)
				if (!bone.collected && !bone.dropping && distance < DOG_SIZE / 1.5) {
					setAction('stand')
					setTimeout(() => setAction(behaviorState === 'chasing' ? 'run' : 'walk'), 500)

					return { ...bone, collected: true }
				}

				return bone
			}),
		)

		if (bones.some((b) => b.collected)) {
			setTimeout(() => {
				setBones((prev) => prev.filter((b) => !b.collected))
			}, 2000)
		}

		updateBehavior()

		if (isMovingToTarget && targetX !== null && (action === 'walk' || action === 'run')) {
			setPosition((prev) => {
				const bounds = getMovementBounds()
				const delta = targetX - prev.x
				const distance = Math.abs(delta)
				const speed = action === 'run' ? RUN_SPEED : WALK_SPEED

				if (distance <= speed) {
					setIsMovingToTarget(false)
					setTargetX(null)
					if (behaviorState === 'chasing') {
						const nextBone = findNearestBone()
						if (!nextBone) {
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
		bones,
		position.x,
		findNearestBone,
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

	useEffect(() => {
		const dogElement = dogRef.current

		const handleMouseEnter = () => {
			setShowName(true)
		}

		const handleMouseLeave = () => {
			setShowName(false)
		}

		if (dogElement) {
			dogElement.addEventListener('mouseenter', handleMouseEnter)
			dogElement.addEventListener('mouseleave', handleMouseLeave)
		}

		return () => {
			if (dogElement) {
				dogElement.removeEventListener('mouseenter', handleMouseEnter)
				dogElement.removeEventListener('mouseleave', handleMouseLeave)
			}
		}
	}, [])

	const getGif = () => {
		switch (action) {
			case 'walk':
				return walking
			case 'run':
				return running
			case 'sit':
				return lie
			case 'stand':
				return swipe
			case 'climb':
				return walking
			case 'idle':
				return idle
			default:
				return idle
		}
	}

	return (
		<div
			ref={containerRef}
			className="absolute hidden w-full h-32 overflow-hidden -bottom-3 lg:flex"
		>
			{/* نمایش استخوان‌ها */}
			{bones.map(
				(bone) =>
					!bone.collected && (
						<motion.div
							key={bone.id}
							className="absolute"
							style={{
								left: `${bone.x}px`,
								bottom: `${bone.y}px`,
								width: `${BONE_SIZE}px`,
								height: `${BONE_SIZE}px`,
							}}
							animate={bone.collected ? { scale: [1, 1.3, 0], opacity: [1, 0.8, 0] } : {}}
							transition={{ duration: 0.5 }}
						>
							<LuBone
								size={BONE_SIZE}
								className={`text-amber-200 drop-shadow-md ${bone.dropping ? 'animate-bounce' : ''}`}
							/>
						</motion.div>
					),
			)}

			<div
				ref={dogRef}
				className="absolute transition-transform duration-300 cursor-pointer"
				style={{
					left: `${position.x}px`,
					bottom: `${position.y}px`,
					transform: `scaleX(${direction})`,
					width: `${DOG_SIZE}px`,
					height: `${DOG_SIZE}px`,
					zIndex: 10,
				}}
			>
				{showName && (
					<div
						className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/60 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap backdrop-blur-sm"
						style={{ transform: `scaleX(${direction})` }}
					>
						{petName || 'آکیتا'}
					</div>
				)}
				<img
					src={getGif()}
					alt="Interactive Dog"
					className="object-cover w-full h-full pointer-events-none"
				/>
			</div>
		</div>
	)
}
