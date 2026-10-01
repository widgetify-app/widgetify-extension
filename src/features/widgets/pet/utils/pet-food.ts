import type { CollectibleItem } from '../types'

const REACH_HEIGHT = 5

interface FoodStep {
	fallStep: number
	petCenter: number
	collectRadius: number
	foodSize: number
	canEat: boolean
}

interface FoodStepResult {
	items: CollectibleItem[]
	changed: boolean
	collectedId: number | null
}

export function foodDropX(dropAtX: number, containerWidth: number, foodSize: number) {
	const maxFoodX = Math.max(0, containerWidth - foodSize)
	return Math.max(0, Math.min(maxFoodX, dropAtX - foodSize / 2))
}

export function findNearestFood(
	items: CollectibleItem[],
	petCenter: number,
	foodSize: number
): CollectibleItem | null {
	const available = items.filter(
		(item) => !item.collected && !item.dropping && item.y <= REACH_HEIGHT
	)
	if (available.length === 0) return null

	const centerOf = (item: CollectibleItem) => item.x + foodSize / 2
	return available.reduce((nearest, item) =>
		Math.abs(petCenter - centerOf(item)) < Math.abs(petCenter - centerOf(nearest))
			? item
			: nearest
	)
}

export function stepCollectibles(
	items: CollectibleItem[],
	step: FoodStep
): FoodStepResult {
	let changed = false
	let collectedId: number | null = null

	const next = items.map((item) => {
		if (item.collected) return item

		if (item.dropping) {
			changed = true
			const nextY = item.y + step.fallStep
			return nextY >= 0 ? { ...item, y: 0, dropping: false } : { ...item, y: nextY }
		}

		if (collectedId === null && step.canEat) {
			const distance = Math.abs(item.x + step.foodSize / 2 - step.petCenter)
			if (distance < step.collectRadius) {
				collectedId = item.id
				changed = true
				return { ...item, collected: true }
			}
		}

		return item
	})

	return { items: next, changed, collectedId }
}
