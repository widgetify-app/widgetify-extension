import type { PriceHistory } from '@/services/currency/get-currency-by-code.hook'

export const CHART_WIDTH = 300
export const CHART_HEIGHT = 120
const CHART_PADDING_Y = 10
const RIAL_PER_TOMAN = 10
const MIN_SPAN_RATIO = 0.08
const POINTS_PER_SMOOTHING_STEP = 12
const TIME_TICK_COUNT = 5

interface ChartPoint {
	x: number
	y: number
	value: number
	time: number
}

export interface PriceChart {
	points: ChartPoint[]
	timeTicks: number[]
	linePath: string
	areaPath: string
	changePercentage: number
}

export function toDisplayValue(price: number, isDollar: boolean): number {
	return isDollar ? price : price / RIAL_PER_TOMAN
}

function rollingAverage(values: number[]): number[] {
	const radius = Math.round(values.length / POINTS_PER_SMOOTHING_STEP)
	if (radius === 0) return values
	return values.map((_, index) => {
		const window = values.slice(Math.max(0, index - radius), index + radius + 1)
		return window.reduce((sum, value) => sum + value, 0) / window.length
	})
}

function toCurvePath(points: ChartPoint[]): string {
	const coord = (point: { x: number; y: number }) =>
		`${point.x.toFixed(1)},${point.y.toFixed(1)}`
	let path = `M${coord(points[0])}`
	for (let index = 0; index < points.length - 1; index++) {
		const before = points[index - 1] ?? points[index]
		const from = points[index]
		const to = points[index + 1]
		const after = points[index + 2] ?? to
		const start = {
			x: from.x + (to.x - before.x) / 6,
			y: from.y + (to.y - before.y) / 6,
		}
		const end = { x: to.x - (after.x - from.x) / 6, y: to.y - (after.y - from.y) / 6 }
		path += ` C${coord(start)} ${coord(end)} ${coord(to)}`
	}
	return path
}

export function buildPriceChart(
	history: PriceHistory[],
	isDollar: boolean
): PriceChart | null {
	const samples = history
		.map((item) => ({
			value: toDisplayValue(item.price, isDollar),
			time: Date.parse(item.createdAt),
		}))
		.filter((sample) => Number.isFinite(sample.value) && Number.isFinite(sample.time))
		.sort((a, b) => a.time - b.time)

	if (samples.length < 2) return null

	const values = samples.map((sample) => sample.value)
	const smoothed = rollingAverage(values)
	const middle = (Math.min(...smoothed) + Math.max(...smoothed)) / 2
	const span = Math.max(
		Math.max(...smoothed) - Math.min(...smoothed),
		Math.abs(middle) * MIN_SPAN_RATIO
	)
	const low = middle - span / 2
	const first = samples[0]
	const last = samples[samples.length - 1]
	const timeSpan = last.time - first.time
	const drawableHeight = CHART_HEIGHT - CHART_PADDING_Y * 2

	const toY = (value: number) =>
		span === 0
			? CHART_HEIGHT / 2
			: CHART_PADDING_Y + (1 - (value - low) / span) * drawableHeight

	const points = samples.map((sample, index) => ({
		...sample,
		x:
			timeSpan === 0
				? (index / (samples.length - 1)) * CHART_WIDTH
				: ((sample.time - first.time) / timeSpan) * CHART_WIDTH,
		y: toY(smoothed[index]),
	}))

	const linePath = toCurvePath(points)

	return {
		points,
		timeTicks: Array.from(
			{ length: TIME_TICK_COUNT },
			(_, index) => first.time + (timeSpan * index) / (TIME_TICK_COUNT - 1)
		),
		linePath,
		areaPath: `${linePath} L${CHART_WIDTH},${CHART_HEIGHT} L0,${CHART_HEIGHT} Z`,
		changePercentage:
			first.value === 0 ? 0 : ((last.value - first.value) / first.value) * 100,
	}
}

export function nearestPointIndex(points: ChartPoint[], x: number): number {
	let nearest = 0
	for (let index = 1; index < points.length; index++) {
		if (Math.abs(points[index].x - x) < Math.abs(points[nearest].x - x))
			nearest = index
	}
	return nearest
}
