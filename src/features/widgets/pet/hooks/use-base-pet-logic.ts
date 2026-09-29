import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MAX_ACTIVE_PET_FOOD } from '../constants'
import {
	COLLECT_HEIGHT,
	flightBob,
	pickCruiseAltitude,
	stepDive,
	stepFlight,
	stepLanding,
} from '../utils/pet-flight'
import { createHopState, type HopPhase, type HopState, stepHop } from '../utils/pet-hop'
import {
	clampToBounds,
	frameScale,
	getMovementBounds,
	stepWalk,
} from '../utils/pet-movement'
import { chooseTickMode, IDLE_POLL_MS } from '../utils/pet-schedule'
import {
	chooseNextState,
	facingOf,
	hasReachedWall,
	holdMsFor,
	MAX_MOVE_MS,
	paceOf,
	START_STATE,
} from '../utils/pet-sequence'
import type {
	CollectibleItem,
	PetAnimations,
	PetAssets,
	PetDimensions,
	PetSequence,
	PetState,
	Position,
} from '../types'

const FALL_SPEED = 1.5
const MIN_TICK_MS = 16
const MAX_TICK_MS = 250
const HOP_ARRIVAL = 2
const SPEED_VARIANCE = 0.25
const AIRBORNE_HEIGHT = 0.5

interface BasePetProps {
	name: string
	animations: PetAnimations
	dimensions: PetDimensions
	sequence: PetSequence
	assets: PetAssets
	onCollectibleCollection: (collectedItemId: number) => void
	onLevelDownHungryState: () => void
	isHungry: boolean
}

interface ActiveState {
	current: PetState
	elapsedMs: number
	holdMs: number
}

interface ContainerSize {
	width: number
	height: number
}

export function useBasePetLogic(props: BasePetProps) {
	const containerRef = useRef<HTMLButtonElement>(null)
	const petRef = useRef<HTMLDivElement>(null)

	const [direction, setDirection] = useState(1)
	const [petState, setPetState] = useState<PetState>(START_STATE)
	const [hopPhase, setHopPhase] = useState<HopPhase>('crouch')
	const [airborne, setAirborne] = useState(false)
	const [showName, setShowName] = useState(false)
	const [collectibles, setCollectibles] = useState<CollectibleItem[]>([])

	const propsRef = useRef(props)
	propsRef.current = props

	const positionRef = useRef<Position>({ x: 30, y: 0 })
	const paintedRef = useRef('')
	const airborneRef = useRef(false)
	const sizeRef = useRef<ContainerSize>({ width: 0, height: 0 })
	const directionRef = useRef(1)
	const activeRef = useRef<ActiveState>({
		current: START_STATE,
		elapsedMs: 0,
		holdMs: holdMsFor(START_STATE, Math.random),
	})
	const hopRef = useRef<HopState | null>(null)
	const collectiblesRef = useRef<CollectibleItem[]>([])
	const collectibleIdRef = useRef(0)
	const cruiseAltitudeRef = useRef(0)
	const speedVarianceRef = useRef(
		1 - SPEED_VARIANCE + Math.random() * 2 * SPEED_VARIANCE
	)
	const wakeRef = useRef<() => void>(() => {})

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

	const applyHop = useCallback((next: HopState) => {
		hopRef.current = next
		setHopPhase((previous) => (previous === next.phase ? previous : next.phase))
	}, [])

	const applyCollectibles = useCallback((next: CollectibleItem[]) => {
		collectiblesRef.current = next
		setCollectibles(next)
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
	}, [])

	const enterState = useCallback(
		(next: PetState, voluntary: boolean) => {
			const { dimensions, onLevelDownHungryState } = propsRef.current
			const pace = paceOf(next)
			const facing = facingOf(next)

			activeRef.current = {
				current: next,
				elapsedMs: 0,
				holdMs: holdMsFor(next, Math.random),
			}
			setPetState(next)
			if (facing !== 0) applyDirection(facing)

			if (dimensions.flight && (pace === 'walk' || pace === 'run')) {
				cruiseAltitudeRef.current = pickCruiseAltitude(
					dimensions.flight,
					getBounds(),
					Math.random()
				)
			}
			if (dimensions.hop && pace !== 'still') {
				applyHop(createHopState(dimensions.hop, pace !== 'walk', Math.random))
			}
			if (voluntary) onLevelDownHungryState()
		},
		[applyDirection, applyHop, getBounds]
	)

	const dropFood = useCallback(
		(dropAtX: number) => {
			const container = containerRef.current
			if (!container) return

			const uneatenFood = collectiblesRef.current.filter((item) => !item.collected)
			if (uneatenFood.length >= MAX_ACTIVE_PET_FOOD) return

			const { assets } = propsRef.current
			const rect = container.getBoundingClientRect()
			const maxFoodX = Math.max(0, rect.width - assets.collectibleSize)
			const foodX = Math.max(
				0,
				Math.min(maxFoodX, dropAtX - assets.collectibleSize / 2)
			)

			applyCollectibles([
				...collectiblesRef.current,
				{
					id: collectibleIdRef.current,
					x: foodX,
					y: -assets.collectibleSize,
					collected: false,
					dropping: true,
				},
			])
			collectibleIdRef.current += 1
			wakeRef.current()
		},
		[applyCollectibles]
	)

	const handleClick = useCallback(
		(e: MouseEvent) => {
			const container = containerRef.current
			if (!container) return

			if (e.detail === 0) {
				const { dimensions } = propsRef.current
				const bounds = getBounds()
				const petCenter = positionRef.current.x + dimensions.width / 2
				const offset = bounds.maxX > bounds.minX ? dimensions.width : 0
				dropFood(petCenter + offset)
				return
			}

			dropFood(e.clientX - container.getBoundingClientRect().left)
		},
		[dropFood, getBounds]
	)

	const findNearestFood = useCallback(() => {
		const { dimensions, assets } = propsRef.current
		const available = collectiblesRef.current.filter(
			(item) => !item.collected && !item.dropping && item.y <= 5
		)
		if (available.length === 0) return null

		const petCenter = positionRef.current.x + dimensions.width / 2
		const centerOf = (item: CollectibleItem) => item.x + assets.collectibleSize / 2
		return available.reduce((nearest, item) =>
			Math.abs(petCenter - centerOf(item)) < Math.abs(petCenter - centerOf(nearest))
				? item
				: nearest
		)
	}, [])

	const updateCollectibles = useCallback(
		(scale: number) => {
			const previous = collectiblesRef.current
			if (previous.length === 0) return

			const { dimensions, assets } = propsRef.current
			const fallStep = assets.collectibleFallSpeed * scale
			const petCenter = positionRef.current.x + dimensions.width / 2
			const collectRadius = dimensions.width / 2
			const lowEnoughToEat =
				!dimensions.flight || positionRef.current.y <= COLLECT_HEIGHT

			let changed = false
			let collectedId: number | null = null

			const updated = previous.map((item) => {
				if (item.collected) return item

				if (item.dropping) {
					changed = true
					const nextY = item.y + fallStep
					return nextY >= 0
						? { ...item, y: 0, dropping: false }
						: { ...item, y: nextY }
				}

				if (collectedId === null && lowEnoughToEat) {
					const distance = Math.abs(
						item.x + assets.collectibleSize / 2 - petCenter
					)
					if (distance < collectRadius) {
						collectedId = item.id
						changed = true
						return { ...item, collected: true }
					}
				}

				return item
			})

			if (changed) applyCollectibles(updated)

			if (collectedId !== null) {
				enterState('eat', false)
				propsRef.current.onCollectibleCollection(collectedId)
			}
		},
		[applyCollectibles, enterState]
	)

	useEffect(() => {
		if (!collectibles.some((item) => item.collected)) return
		const timer = setTimeout(() => {
			applyCollectibles(collectiblesRef.current.filter((item) => !item.collected))
		}, 2000)
		return () => clearTimeout(timer)
	}, [collectibles, applyCollectibles])

	const speedFor = useCallback((pace: 'walk' | 'run' | 'chase') => {
		const { dimensions } = propsRef.current
		const base = pace === 'walk' ? dimensions.walkSpeed : dimensions.runSpeed
		return base * speedVarianceRef.current
	}, [])

	const stepStill = useCallback((current: Position, scale: number): Position => {
		if (current.y <= 0) return current
		const landRate = propsRef.current.dimensions.flight?.landRate ?? FALL_SPEED
		return { ...current, y: stepLanding(current.y, landRate * scale) }
	}, [])

	const stepAlong = useCallback(
		(
			current: Position,
			facing: number,
			pace: 'walk' | 'run',
			scale: number,
			elapsed: number
		): Position => {
			const { dimensions } = propsRef.current
			const bounds = getBounds()
			const speed = speedFor(pace)

			if (dimensions.hop) {
				const result = stepHop({
					state:
						hopRef.current ??
						createHopState(dimensions.hop, pace === 'run', Math.random),
					position: current,
					direction: facing,
					hop: dimensions.hop,
					fast: pace === 'run',
					elapsedMs: elapsed,
					bounds,
					targetX: null,
					random: Math.random,
				})
				applyHop(result.state)
				return result.position
			}

			if (dimensions.flight) {
				return stepFlight(
					current,
					facing,
					speed * scale,
					cruiseAltitudeRef.current +
						flightBob(dimensions.flight, performance.now()),
					dimensions.flight.climbRate * scale,
					bounds
				).position
			}

			return stepWalk(current, facing, speed * scale, FALL_SPEED * scale, bounds)
				.position
		},
		[getBounds, speedFor, applyHop]
	)

	const stepTowardFood = useCallback(
		(
			current: Position,
			targetX: number,
			scale: number,
			elapsed: number
		): Position => {
			const { dimensions } = propsRef.current
			const bounds = getBounds()
			const delta = targetX - current.x
			const distance = Math.abs(delta)
			const step = speedFor('chase') * scale
			const flight = dimensions.flight

			const heightNow = (remaining: number) =>
				flight
					? stepDive(
							current.y,
							remaining,
							flight.diveRate * scale,
							flight.diveSlope
						)
					: current.y

			if (dimensions.hop) {
				if (distance <= HOP_ARRIVAL) return { x: targetX, y: 0 }
				const result = stepHop({
					state:
						hopRef.current ??
						createHopState(dimensions.hop, true, Math.random),
					position: current,
					direction: directionRef.current,
					hop: dimensions.hop,
					fast: true,
					elapsedMs: elapsed,
					bounds,
					targetX,
					random: Math.random,
				})
				applyHop(result.state)
				applyDirection(result.direction)
				return result.position
			}

			if (distance <= step) return { x: targetX, y: heightNow(0) }

			applyDirection(delta > 0 ? 1 : -1)
			return clampToBounds(
				{ x: current.x + Math.sign(delta) * step, y: heightNow(distance) },
				bounds
			)
		},
		[getBounds, speedFor, applyHop, applyDirection]
	)

	const tick = useCallback(
		(elapsed: number) => {
			const { dimensions, sequence, assets, isHungry } = propsRef.current
			const scale = frameScale(elapsed)
			const bounds = getBounds()

			updateCollectibles(scale)

			const food = findNearestFood()
			const beforeState = activeRef.current.current
			if (food && beforeState !== 'chase' && beforeState !== 'eat') {
				enterState('chase', false)
			}

			const active = activeRef.current
			active.elapsedMs += elapsed
			const pace = paceOf(active.current)
			let next = positionRef.current
			let finished = false

			if (pace === 'still') {
				next = stepStill(next, scale)
				finished = active.elapsedMs >= active.holdMs
			} else if (pace === 'chase') {
				if (food) {
					const target = Math.max(
						bounds.minX,
						Math.min(
							bounds.maxX,
							food.x + assets.collectibleSize / 2 - dimensions.width / 2
						)
					)
					next = stepTowardFood(next, target, scale, elapsed)
				} else {
					enterState(
						chooseNextState(sequence, 'eat', isHungry, Math.random),
						true
					)
				}
			} else {
				next = stepAlong(next, facingOf(active.current), pace, scale, elapsed)
				finished =
					hasReachedWall(active.current, next.x, bounds) ||
					active.elapsedMs >= MAX_MOVE_MS
			}

			applyPosition(next)

			if (finished) {
				enterState(
					chooseNextState(sequence, active.current, isHungry, Math.random),
					true
				)
			}
		},
		[
			getBounds,
			updateCollectibles,
			findNearestFood,
			enterState,
			stepStill,
			stepAlong,
			stepTowardFood,
			applyPosition,
		]
	)

	const tickRef = useRef(tick)
	tickRef.current = tick

	useEffect(() => {
		let frame: number | null = null
		let timer: ReturnType<typeof setTimeout> | null = null
		let visible = true
		let stopped = false
		let lastTick = performance.now()

		const cancelScheduled = () => {
			if (frame !== null) cancelAnimationFrame(frame)
			if (timer !== null) clearTimeout(timer)
			frame = null
			timer = null
		}

		const schedule = () => {
			if (stopped) return

			const mode = chooseTickMode({
				visible,
				still: paceOf(activeRef.current.current) === 'still',
				grounded: positionRef.current.y <= 0,
				hasFood: collectiblesRef.current.some((item) => !item.collected),
			})

			if (mode === 'idle') timer = setTimeout(run, IDLE_POLL_MS)
			else if (mode === 'frame') frame = requestAnimationFrame(run)
		}

		const run = () => {
			frame = null
			timer = null

			const now = performance.now()
			const elapsed = now - lastTick
			if (elapsed >= MIN_TICK_MS) {
				lastTick = now
				tickRef.current(Math.min(elapsed, MAX_TICK_MS))
			}
			schedule()
		}

		wakeRef.current = () => {
			cancelScheduled()
			schedule()
		}

		const container = containerRef.current
		const observer = container
			? new IntersectionObserver((entries) => {
					const entry = entries[entries.length - 1]
					if (!entry || entry.isIntersecting === visible) return

					visible = entry.isIntersecting
					cancelScheduled()
					if (visible) {
						lastTick = performance.now()
						schedule()
					}
				})
			: null
		if (container) observer?.observe(container)

		schedule()

		return () => {
			stopped = true
			cancelScheduled()
			observer?.disconnect()
			wakeRef.current = () => {}
		}
	}, [])

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

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		container.addEventListener('click', handleClick)
		return () => container.removeEventListener('click', handleClick)
	}, [handleClick])

	useEffect(() => {
		const petElement = petRef.current
		if (!petElement) return

		const show = () => setShowName(true)
		const hide = () => setShowName(false)

		petElement.addEventListener('mouseenter', show)
		petElement.addEventListener('mouseleave', hide)
		return () => {
			petElement.removeEventListener('mouseenter', show)
			petElement.removeEventListener('mouseleave', hide)
		}
	}, [])

	const { animations, dimensions } = props

	const animationSrc = useMemo(() => {
		if (dimensions.flight && airborne && animations.fly) return animations.fly

		const hopping = dimensions.hop !== undefined && paceOf(petState) !== 'still'
		if (hopping) return hopPhase === 'air' ? animations.run : animations.idle

		switch (petState) {
			case 'lie':
				return animations.sit || animations.idle
			case 'eat':
				return animations.swipe || animations.idle
			case 'walk-right':
			case 'walk-left':
				return animations.walk
			case 'run-right':
			case 'run-left':
			case 'chase':
				return animations.run
			default:
				return animations.idle
		}
	}, [petState, hopPhase, airborne, animations, dimensions])

	return {
		containerRef,
		petRef,
		direction: dimensions.sidestep ? 1 : direction,
		showName,
		airborne,
		collectibles,
		animationSrc,
		dimensions,
		assets: props.assets,
	}
}
