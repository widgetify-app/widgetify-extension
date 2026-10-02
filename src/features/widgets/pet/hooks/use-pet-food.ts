import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { MAX_ACTIVE_PET_FOOD } from '../constants'
import type { CollectibleItem, PetLogicProps, Position } from '../types'
import { COLLECT_HEIGHT } from '../utils/pet-flight'
import { findNearestFood, foodDropX, stepCollectibles } from '../utils/pet-food'
import type { MovementBounds } from '../utils/pet-movement'

const EATEN_LINGER_MS = 2000

interface PetFoodDeps {
	propsRef: RefObject<PetLogicProps>
	containerRef: RefObject<HTMLButtonElement | null>
	positionRef: RefObject<Position>
	wakeRef: RefObject<() => void>
	getBounds: () => MovementBounds
	onEat: () => void
}

export function usePetFood({
	propsRef,
	containerRef,
	positionRef,
	wakeRef,
	getBounds,
	onEat,
}: PetFoodDeps) {
	const [collectibles, setCollectibles] = useState<CollectibleItem[]>([])
	const collectiblesRef = useRef<CollectibleItem[]>([])
	const collectibleIdRef = useRef(0)

	const applyCollectibles = useCallback((next: CollectibleItem[]) => {
		collectiblesRef.current = next
		setCollectibles(next)
	}, [])

	const dropFood = useCallback(
		(dropAtX: number) => {
			const container = containerRef.current
			if (!container) return

			const uneatenFood = collectiblesRef.current.filter((item) => !item.collected)
			if (uneatenFood.length >= MAX_ACTIVE_PET_FOOD) return

			const { assets } = propsRef.current
			const rect = container.getBoundingClientRect()

			applyCollectibles([
				...collectiblesRef.current,
				{
					id: collectibleIdRef.current,
					x: foodDropX(dropAtX, rect.width, assets.collectibleSize),
					y: -assets.collectibleSize,
					collected: false,
					dropping: true,
				},
			])
			collectibleIdRef.current += 1
			wakeRef.current()
		},
		[containerRef, propsRef, wakeRef, applyCollectibles]
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
		[containerRef, propsRef, positionRef, dropFood, getBounds]
	)

	const nearestFood = useCallback(() => {
		const { dimensions, assets } = propsRef.current
		const petCenter = positionRef.current.x + dimensions.width / 2
		return findNearestFood(collectiblesRef.current, petCenter, assets.collectibleSize)
	}, [propsRef, positionRef])

	const updateCollectibles = useCallback(
		(scale: number) => {
			const previous = collectiblesRef.current
			if (previous.length === 0) return

			const { dimensions, assets } = propsRef.current
			const result = stepCollectibles(previous, {
				fallStep: assets.collectibleFallSpeed * scale,
				petCenter: positionRef.current.x + dimensions.width / 2,
				collectRadius: dimensions.width / 2,
				foodSize: assets.collectibleSize,
				canEat: !dimensions.flight || positionRef.current.y <= COLLECT_HEIGHT,
			})

			if (result.changed) applyCollectibles(result.items)

			if (result.collectedId !== null) {
				onEat()
				propsRef.current.onCollectibleCollection(result.collectedId)
			}
		},
		[propsRef, positionRef, applyCollectibles, onEat]
	)

	useEffect(() => {
		if (!collectibles.some((item) => item.collected)) return
		const timer = setTimeout(() => {
			applyCollectibles(collectiblesRef.current.filter((item) => !item.collected))
		}, EATEN_LINGER_MS)
		return () => clearTimeout(timer)
	}, [collectibles, applyCollectibles])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		container.addEventListener('click', handleClick)
		return () => container.removeEventListener('click', handleClick)
	}, [containerRef, handleClick])

	return { collectibles, collectiblesRef, nearestFood, updateCollectibles }
}
