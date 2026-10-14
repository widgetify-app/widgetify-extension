import type { PriceHistory } from '@/services/currency/get-currency-by-code.hook'

export const CHART_WIDTH = 300
export const CHART_HEIGHT = 120
const CHART_PADDING_Y = 10
const RIAL_PER_TOMAN = 10

interface ChartPoint {
	x: number
	y: number
	value: number
	time: number
}

export interface PriceChart {
	points: ChartPoint[]
	linePath: string
	areaPath: string
	min: number
	max: number
	changePercentage: number
}

export function toDisplayValue(price: number, isDollar: boolean): number {
	return isDollar ? price : price / RIAL_PER_TOMAN
}

function toPath(points: ChartPoint[]): string {
	return points
		.map(
			(point, index) =>
				`${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`
		)
		.join(' ')
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
	const min = Math.min(...values)
	const max = Math.max(...values)
	const valueSpan = max - min
	const first = samples[0]
	const last = samples[samples.length - 1]
	const timeSpan = last.time - first.time
	const drawableHeight = CHART_HEIGHT - CHART_PADDING_Y * 2

	const points = samples.map((sample, index) => ({
		...sample,
		x:
			timeSpan === 0
				? (index / (samples.length - 1)) * CHART_WIDTH
				: ((sample.time - first.time) / timeSpan) * CHART_WIDTH,
		y:
			valueSpan === 0
				? CHART_HEIGHT / 2
				: CHART_PADDING_Y +
					(1 - (sample.value - min) / valueSpan) * drawableHeight,
	}))

	const linePath = toPath(points)

	return {
		points,
		linePath,
		areaPath: `${linePath} L${CHART_WIDTH},${CHART_HEIGHT} L0,${CHART_HEIGHT} Z`,
		min,
		max,
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
