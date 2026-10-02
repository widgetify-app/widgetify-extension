import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PetLogicProps, PetState } from '../types'
import { frameScale } from '../utils/pet-movement'
import {
	chooseNextState,
	facingOf,
	hasReachedWall,
	holdMsFor,
	MAX_MOVE_MS,
	paceOf,
	START_STATE,
} from '../utils/pet-sequence'
import { pickPetAnimation } from '../utils/pick-pet-animation'
import { usePetBody } from './use-pet-body'
import { usePetFood } from './use-pet-food'
import { usePetLoop } from './use-pet-loop'
import { usePetMotion } from './use-pet-motion'

interface ActiveState {
	current: PetState
	elapsedMs: number
	holdMs: number
}

export function useBasePetLogic(props: PetLogicProps) {
	const propsRef = useRef(props)
	propsRef.current = props

	const wakeRef = useRef<() => void>(() => {})
	const activeRef = useRef<ActiveState>({
		current: START_STATE,
		elapsedMs: 0,
		holdMs: holdMsFor(START_STATE, Math.random),
	})

	const [petState, setPetState] = useState<PetState>(START_STATE)
	const [showName, setShowName] = useState(false)

	const {
		containerRef,
		petRef,
		positionRef,
		directionRef,
		direction,
		airborne,
		applyPosition,
		applyDirection,
		getBounds,
	} = usePetBody(propsRef)

	const { hopPhase, begin, stepStill, stepAlong, stepTowardFood } = usePetMotion({
		propsRef,
		directionRef,
		getBounds,
		applyDirection,
	})

	const enterState = useCallback(
		(next: PetState, voluntary: boolean) => {
			activeRef.current = {
				current: next,
				elapsedMs: 0,
				holdMs: holdMsFor(next, Math.random),
			}
			setPetState(next)

			const facing = facingOf(next)
			if (facing !== 0) applyDirection(facing)

			begin(paceOf(next))
			if (voluntary) propsRef.current.onLevelDownHungryState()
		},
		[applyDirection, begin]
	)

	const eat = useCallback(() => enterState('eat', false), [enterState])

	const { collectibles, collectiblesRef, nearestFood, updateCollectibles } = usePetFood(
		{
			propsRef,
			containerRef,
			positionRef,
			wakeRef,
			getBounds,
			onEat: eat,
		}
	)

	const tick = (elapsed: number) => {
		const { dimensions, sequence, assets, isHungry } = propsRef.current
		const scale = frameScale(elapsed)
		const bounds = getBounds()

		updateCollectibles(scale)

		const food = nearestFood()
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
				enterState(chooseNextState(sequence, 'eat', isHungry, Math.random), true)
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
	}

	usePetLoop({
		containerRef,
		wakeRef,
		tick,
		readFacts: () => ({
			still: paceOf(activeRef.current.current) === 'still',
			grounded: positionRef.current.y <= 0,
			hasFood: collectiblesRef.current.some((item) => !item.collected),
		}),
	})

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
	}, [petRef])

	const { animations, dimensions } = props

	const animationSrc = useMemo(
		() => pickPetAnimation({ petState, hopPhase, airborne, animations, dimensions }),
		[petState, hopPhase, airborne, animations, dimensions]
	)

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
