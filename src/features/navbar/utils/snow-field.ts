export const FLAKE_COUNT = 16
export const FLAKE_SIZE: [number, number] = [9, 14]
export const FLAKE_SPEED: [number, number] = [0.2, 0.6]
const FLAKE_ALPHA: [number, number] = [0.5, 1]

const RESPAWN_AT = 1.1
const RESPAWN_RANGE = 1.2

interface Flake {
	x: number
	y: number
	size: number
	speed: number
	alpha: number
	sprite: number
}

function between(range: [number, number], random: () => number): number {
	return range[0] + random() * (range[1] - range[0])
}

export function createFlakes(
	count: number,
	spriteCount: number,
	random: () => number
): Flake[] {
	return Array.from({ length: count }, () => ({
		x: random(),
		y: random(),
		size: between(FLAKE_SIZE, random),
		speed: between(FLAKE_SPEED, random),
		alpha: between(FLAKE_ALPHA, random),
		sprite: Math.floor(random() * spriteCount),
	}))
}

export function advanceFlakes(flakes: Flake[], seconds: number): void {
	for (const flake of flakes) {
		flake.y += flake.speed * seconds

		if (flake.y > RESPAWN_AT) flake.y -= RESPAWN_RANGE
	}
}
