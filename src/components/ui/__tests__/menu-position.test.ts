import { describe, expect, it } from 'bun:test'
import {
	fitMenuHorizontally,
	pickMenuSide,
	placeMenuOnSide,
} from '../utils/menu-position'

describe('pickMenuSide', () => {
	it('opens below the anchor when it fits', () => {
		expect(
			pickMenuSide({ top: 100, flipBottom: 90, height: 300, viewportHeight: 800 })
		).toBe('below')
	})

	it('opens above the anchor when there is no room below', () => {
		expect(
			pickMenuSide({ top: 620, flipBottom: 600, height: 360, viewportHeight: 800 })
		).toBe('above')
	})

	it('takes the roomier side when neither fits', () => {
		expect(
			pickMenuSide({ top: 300, flipBottom: 280, height: 500, viewportHeight: 600 })
		).toBe('below')
	})
})

describe('placeMenuOnSide', () => {
	it('keeps a menu below its anchor where it fits', () => {
		expect(
			placeMenuOnSide('below', {
				top: 100,
				flipBottom: 90,
				height: 300,
				viewportHeight: 800,
			})
		).toBe(100)
	})

	it('puts a menu above its anchor with its bottom on the anchor', () => {
		expect(
			placeMenuOnSide('above', {
				top: 620,
				flipBottom: 600,
				height: 360,
				viewportHeight: 800,
			})
		).toBe(240)
	})

	it('lifts a menu that grew past the bottom edge without flipping it', () => {
		expect(
			placeMenuOnSide('below', {
				top: 300,
				flipBottom: 280,
				height: 500,
				viewportHeight: 600,
			})
		).toBe(88)
	})

	it('never goes above the top edge', () => {
		expect(
			placeMenuOnSide('above', {
				top: 200,
				flipBottom: 180,
				height: 900,
				viewportHeight: 600,
			})
		).toBe(12)
	})
})

describe('fitMenuHorizontally', () => {
	it('keeps a menu that fits where it is', () => {
		expect(fitMenuHorizontally(300, 228, 1000)).toBe(300)
	})

	it('pulls a menu back from the right edge', () => {
		expect(fitMenuHorizontally(900, 228, 1000)).toBe(760)
	})

	it('pulls a menu back from the left edge', () => {
		expect(fitMenuHorizontally(-40, 228, 1000)).toBe(12)
	})
})
