import type { PetFlight, Position } from '../types'

interface FlightBounds {
	minX: number
	maxX: number
	minY: number
	maxY: number
}

export const COLLECT_HEIGHT = 6

export function pickCruiseAltitude(
	profile: PetFlight,
	bounds: FlightBounds,
	random: number
): number {
	const low = Math.min(profile.cruiseMin, bounds.maxY)
	const high = Math.min(profile.cruiseMax, bounds.maxY)
	return low + (high - low) * random
}

export function flightBob(profile: PetFlight, timeMs: number): number {
	return profile.bobAmplitude * Math.sin((2 * Math.PI * timeMs) / profile.bobPeriodMs)
}

function approach(current: number, target: number, maxStep: number): number {
	if (Math.abs(target - current) <= maxStep) return target
	return current + Math.sign(target - current) * maxStep
}

function stepAltitude(
	currentY: number,
	altitude: number,
	climbStep: number,
	bounds: { minY: number; maxY: number }
): number {
	const targetY = Math.max(bounds.minY, Math.min(bounds.maxY, altitude))
	return approach(currentY, targetY, climbStep)
}

export function stepFlight(
	position: Position,
	direction: number,
	speed: number,
	altitude: number,
	climbStep: number,
	bounds: FlightBounds
): { position: Position; direction: number } {
	let x = position.x + direction * speed
	let nextDirection = direction

	if (x >= bounds.maxX) {
		nextDirection = -1
		x = bounds.maxX
	} else if (x <= bounds.minX) {
		nextDirection = 1
		x = bounds.minX
	}

	const y = stepAltitude(position.y, altitude, climbStep, bounds)

	return { position: { x, y }, direction: nextDirection }
}

export function stepLanding(currentY: number, landStep: number): number {
	return Math.max(0, currentY - landStep)
}

export function stepDive(
	currentY: number,
	distanceX: number,
	diveStep: number,
	slope: number
): number {
	const glideCeiling = Math.min(currentY, distanceX * slope)
	return Math.max(glideCeiling, currentY - diveStep, 0)
}
