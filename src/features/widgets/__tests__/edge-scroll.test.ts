import { describe, expect, it } from 'bun:test'
import {
	EDGE_SCROLL_MAX_STEP_PX,
	EDGE_SCROLL_ZONE_PX,
	edgeScrollStep,
} from '../utils/edge-scroll'

const TOP = 0
const BOTTOM = 800

describe('edgeScrollStep', () => {
	it('does not scroll while the pointer is away from both edges', () => {
		expect(edgeScrollStep(400, TOP, BOTTOM)).toBe(0)
		expect(edgeScrollStep(TOP + EDGE_SCROLL_ZONE_PX, TOP, BOTTOM)).toBe(0)
		expect(edgeScrollStep(BOTTOM - EDGE_SCROLL_ZONE_PX, TOP, BOTTOM)).toBe(0)
	})

	it('scrolls up near the top, so a widget can be carried to the first row', () => {
		expect(edgeScrollStep(TOP + 10, TOP, BOTTOM)).toBeLessThan(0)
	})

	it('scrolls down near the bottom', () => {
		expect(edgeScrollStep(BOTTOM - 10, TOP, BOTTOM)).toBeGreaterThan(0)
	})

	it('speeds up the closer the pointer gets to the edge', () => {
		const near = Math.abs(edgeScrollStep(TOP + 10, TOP, BOTTOM))
		const far = Math.abs(edgeScrollStep(TOP + 60, TOP, BOTTOM))
		expect(near).toBeGreaterThan(far)
	})

	it('caps the speed when the pointer leaves the scroll area', () => {
		expect(edgeScrollStep(TOP - 200, TOP, BOTTOM)).toBe(-EDGE_SCROLL_MAX_STEP_PX)
		expect(edgeScrollStep(BOTTOM + 200, TOP, BOTTOM)).toBe(EDGE_SCROLL_MAX_STEP_PX)
	})

	it('measures from the scroll area, not from the window', () => {
		expect(edgeScrollStep(130, 120, BOTTOM)).toBeLessThan(0)
		expect(edgeScrollStep(130, TOP, BOTTOM)).toBe(0)
	})
})
