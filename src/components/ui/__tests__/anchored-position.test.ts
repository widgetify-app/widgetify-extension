import { describe, expect, it } from 'bun:test'
import {
	type AnchorBox,
	EDGE_PADDING,
	isAnchorInViewport,
	resolveAnchoredPlacement,
} from '../utils/anchored-position'

const VIEWPORT = { width: 1000, height: 800 }
const OVERLAY = { width: 240, height: 200 }

function anchor(top: number, left = 400, width = 40, height = 40): AnchorBox {
	return {
		top,
		left,
		right: left + width,
		bottom: top + height,
		width,
		height,
	}
}

describe('isAnchorInViewport', () => {
	it('accepts an anchor fully inside the viewport', () => {
		expect(isAnchorInViewport(anchor(300), VIEWPORT)).toBe(true)
	})

	it('accepts an anchor that is only partly scrolled past the top edge', () => {
		expect(isAnchorInViewport(anchor(-20), VIEWPORT)).toBe(true)
	})

	it('rejects an anchor scrolled completely above the viewport', () => {
		expect(isAnchorInViewport(anchor(-40), VIEWPORT)).toBe(false)
		expect(isAnchorInViewport(anchor(-200), VIEWPORT)).toBe(false)
	})

	it('rejects an anchor scrolled completely below the viewport', () => {
		expect(isAnchorInViewport(anchor(VIEWPORT.height), VIEWPORT)).toBe(false)
	})
})

describe('resolveAnchoredPlacement', () => {
	it('centres a top placement above the anchor', () => {
		const { x, y, side } = resolveAnchoredPlacement(
			anchor(400),
			OVERLAY,
			VIEWPORT,
			'top',
			4,
			true
		)

		expect(side).toBe('top')
		expect(x).toBe(400 + 20 - 120)
		expect(y).toBe(400 - 200 - 4)
	})

	it('flips a top placement below the anchor when it would overflow the top', () => {
		const { y, side } = resolveAnchoredPlacement(
			anchor(100),
			OVERLAY,
			VIEWPORT,
			'top',
			4,
			true
		)

		expect(side).toBe('bottom')
		expect(y).toBe(140 + 4)
	})

	it('keeps the requested side when flipping is disabled', () => {
		const { side } = resolveAnchoredPlacement(
			anchor(100),
			OVERLAY,
			VIEWPORT,
			'top',
			4,
			false
		)

		expect(side).toBe('top')
	})

	it('tracks the anchor while it scrolls, instead of sticking to one spot', () => {
		const first = resolveAnchoredPlacement(
			anchor(400),
			OVERLAY,
			VIEWPORT,
			'bottom',
			4,
			true
		)
		const scrolled = resolveAnchoredPlacement(
			anchor(340),
			OVERLAY,
			VIEWPORT,
			'bottom',
			4,
			true
		)

		expect(first.y - scrolled.y).toBe(60)
	})

	it('places on the measured size, so a scaled-in overlay would land elsewhere', () => {
		const settled = resolveAnchoredPlacement(
			anchor(400),
			OVERLAY,
			VIEWPORT,
			'top',
			4,
			true
		)
		const midAnimation = resolveAnchoredPlacement(
			anchor(400),
			{ width: OVERLAY.width * 0.95, height: OVERLAY.height * 0.95 },
			VIEWPORT,
			'top',
			4,
			true
		)

		expect(midAnimation).not.toEqual(settled)
	})

	it('never returns a start smaller than the edge padding', () => {
		const { x, y } = resolveAnchoredPlacement(
			anchor(-500, -500),
			OVERLAY,
			VIEWPORT,
			'top',
			4,
			false
		)

		expect(x).toBe(EDGE_PADDING)
		expect(y).toBe(EDGE_PADDING)
	})

	it('still returns the padding when the overlay is larger than the viewport', () => {
		const { y } = resolveAnchoredPlacement(
			anchor(100),
			{ width: 240, height: 900 },
			VIEWPORT,
			'bottom',
			4,
			false
		)

		expect(y).toBe(EDGE_PADDING)
	})
})
