import { describe, expect, it } from 'bun:test'
import {
	CHART_HEIGHT,
	CHART_WIDTH,
	buildPriceChart,
	nearestPointIndex,
	toDisplayValue,
} from '../utils/build-price-chart'

const at = (day: number, price: number) => ({
	price,
	createdAt: `2026-10-${String(day).padStart(2, '0')}T00:00:00Z`,
})

const hourly = (prices: number[]) =>
	prices.map((price, hour) => ({
		price,
		createdAt: new Date(Date.UTC(2026, 9, 1, hour)).toISOString(),
	}))

const spanOf = (values: number[]) => Math.max(...values) - Math.min(...values)

describe('toDisplayValue', () => {
	it('turns rial into toman and leaves dollars alone', () => {
		expect(toDisplayValue(2620000, false)).toBe(262000)
		expect(toDisplayValue(83000, true)).toBe(83000)
	})
})

describe('buildPriceChart', () => {
	it('needs two usable points to draw a line', () => {
		expect(buildPriceChart([], false)).toBeNull()
		expect(buildPriceChart([at(1, 10)], false)).toBeNull()
		expect(
			buildPriceChart([at(1, 10), { price: 5, createdAt: 'not a date' }], false)
		).toBeNull()
	})

	it('spreads the points over the width by time and puts the highest price on top', () => {
		const chart = buildPriceChart([at(1, 100), at(2, 300), at(4, 200)], true)

		expect(chart?.points.map((point) => Math.round(point.x))).toEqual([
			0,
			Math.round(CHART_WIDTH / 3),
			CHART_WIDTH,
		])
		expect(chart?.points[1].y).toBeLessThan(chart?.points[0].y ?? 0)
		expect(chart?.points[1].y).toBeLessThan(chart?.points[2].y ?? 0)
	})

	it('sorts points that arrive out of order', () => {
		const chart = buildPriceChart([at(3, 30), at(1, 10), at(2, 20)], true)

		expect(chart?.points.map((point) => point.value)).toEqual([10, 20, 30])
	})

	it('measures the change from the first price to the last', () => {
		expect(buildPriceChart([at(1, 100), at(2, 150)], true)?.changePercentage).toBe(50)
		expect(buildPriceChart([at(1, 200), at(2, 150)], true)?.changePercentage).toBe(
			-25
		)
		expect(buildPriceChart([at(1, 0), at(2, 150)], true)?.changePercentage).toBe(0)
	})

	it('draws a flat price through the middle', () => {
		const chart = buildPriceChart([at(1, 100), at(2, 100)], true)

		expect(chart?.points.every((point) => point.y === CHART_HEIGHT / 2)).toBe(true)
	})

	it('spaces points evenly when they share one time', () => {
		const sameTime = { price: 1, createdAt: '2026-10-01T00:00:00Z' }
		const chart = buildPriceChart([sameTime, { ...sameTime, price: 2 }], true)

		expect(chart?.points.map((point) => point.x)).toEqual([0, CHART_WIDTH])
	})

	it('draws the line as curves and closes the area down to the bottom edge', () => {
		const chart = buildPriceChart([at(1, 1), at(2, 2), at(3, 1)], true)

		expect(chart?.linePath.startsWith('M0.0,')).toBe(true)
		expect(chart?.linePath).toContain(' C')
		expect(chart?.areaPath).toBe(
			`${chart?.linePath} L${CHART_WIDTH},${CHART_HEIGHT} L0,${CHART_HEIGHT} Z`
		)
	})

	it('evens out a price that flips between two levels', () => {
		const flipping = hourly(
			Array.from({ length: 30 }, (_, hour) => (hour % 4 < 2 ? 5510000 : 5421200))
		)
		const chart = buildPriceChart(flipping, false)
		const ys = chart?.points.map((point) => point.y) ?? []

		expect(spanOf(ys)).toBeLessThan(CHART_HEIGHT / 10)
		expect(chart?.points[0].value).toBe(551000)
	})

	it('keeps a short history as it is', () => {
		const chart = buildPriceChart([at(1, 100), at(2, 300), at(3, 100)], true)
		const [first, middle] = chart?.points ?? []

		expect(first.y - middle.y).toBeGreaterThan(CHART_HEIGHT / 2)
	})

	it('draws a move of one percent as a small step, not the full height', () => {
		const chart = buildPriceChart([at(1, 5000000), at(2, 5050000)], false)
		const rise = (chart?.points[0].y ?? 0) - (chart?.points[1].y ?? 0)

		expect(rise).toBeGreaterThan(0)
		expect(rise).toBeLessThan(CHART_HEIGHT / 6)
	})

	it('lets a big move fill the chart', () => {
		const chart = buildPriceChart([at(1, 100), at(2, 200)], true)
		const rise = (chart?.points[0].y ?? 0) - (chart?.points[1].y ?? 0)

		expect(rise).toBeGreaterThan(CHART_HEIGHT * 0.7)
	})

	it('converts rial history to toman', () => {
		const chart = buildPriceChart([at(1, 1000), at(2, 2000)], false)

		expect(chart?.points.map((point) => point.value)).toEqual([100, 200])
	})

	it('marks five evenly spaced moments on the time axis, ending at the last price', () => {
		const chart = buildPriceChart([at(1, 1), at(5, 2)], true)
		const first = Date.parse('2026-10-01T00:00:00Z')
		const last = Date.parse('2026-10-05T00:00:00Z')
		const day = 24 * 60 * 60 * 1000

		expect(chart?.timeTicks).toEqual([
			first,
			first + day,
			first + 2 * day,
			first + 3 * day,
			last,
		])
	})
})

describe('nearestPointIndex', () => {
	const points = [0, 100, 300].map((x) => ({ x, y: 0, value: 0, time: 0 }))

	it('picks the point closest to the pointer', () => {
		expect(nearestPointIndex(points, -20)).toBe(0)
		expect(nearestPointIndex(points, 70)).toBe(1)
		expect(nearestPointIndex(points, 250)).toBe(2)
		expect(nearestPointIndex(points, 1000)).toBe(2)
	})
})
