import { type RefObject, useCallback, useRef, useState } from 'react'
import type { PetLogicProps, Position } from '../types'
import {
	flightBob,
	pickCruiseAltitude,
	stepDive,
	stepFlight,
	stepLanding,
} from '../utils/pet-flight'
import { createHopState, type HopPhase, type HopState, stepHop } from '../utils/pet-hop'
import { clampToBounds, type MovementBounds, stepWalk } from '../utils/pet-movement'
import type { Pace } from '../utils/pet-sequence'

const FALL_SPEED = 1.5
const HOP_ARRIVAL = 2
const SPEED_VARIANCE = 0.25

type Moving = Exclude<Pace, 'still'>
type Travelling = Exclude<Moving, 'chase'>

interface PetMotionDeps {
	propsRef: RefObject<PetLogicProps>
	directionRef: RefObject<number>
	getBounds: () => MovementBounds
	applyDirection: (next: number) => void
}

export function usePetMotion({
	propsRef,
	directionRef,
	getBounds,
	applyDirection,
}: PetMotionDeps) {
	const [hopPhase, setHopPhase] = useState<HopPhase>('crouch')

	const hopRef = useRef<HopState | null>(null)
	const cruiseAltitudeRef = useRef(0)
	const speedVarianceRef = useRef(
		1 - SPEED_VARIANCE + Math.random() * 2 * SPEED_VARIANCE
	)

	const applyHop = useCallback((next: HopState) => {
		hopRef.current = next
		setHopPhase((previous) => (previous === next.phase ? previous : next.phase))
	}, [])

	const begin = useCallback(
		(pace: Pace) => {
			const { dimensions } = propsRef.current

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
		},
		[propsRef, getBounds, applyHop]
	)

	const speedFor = useCallback(
		(pace: Moving) => {
			const { dimensions } = propsRef.current
			const base = pace === 'walk' ? dimensions.walkSpeed : dimensions.runSpeed
			return base * speedVarianceRef.current
		},
		[propsRef]
	)

	const stepStill = useCallback(
		(current: Position, scale: number): Position => {
			if (current.y <= 0) return current
			const landRate = propsRef.current.dimensions.flight?.landRate ?? FALL_SPEED
			return { ...current, y: stepLanding(current.y, landRate * scale) }
		},
		[propsRef]
	)

	const stepAlong = useCallback(
		(
			current: Position,
			facing: number,
			pace: Travelling,
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
		[propsRef, getBounds, speedFor, applyHop]
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
		[propsRef, directionRef, getBounds, speedFor, applyHop, applyDirection]
	)

	return { hopPhase, begin, stepStill, stepAlong, stepTowardFood }
}
