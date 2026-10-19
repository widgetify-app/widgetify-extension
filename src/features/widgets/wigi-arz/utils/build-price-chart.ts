import type { PriceHistory } from '@/services/currency/get-currency-by-code.hook'

export const CHART_WIDTH = 300
export const CHART_HEIGHT = 120
const CHART_PADDING_Y = 10
const RIAL_PER_TOMAN = 10
const TICK_INTERVALS = 3
const NICE_STEPS = [1, 2, 2.5, 5, 10]

interface ChartPoint {
	x: number
	y: number
	value: number
	time: number
}

interface ChartTick {
	value: number
	y: number
}

export interface PriceChart {
	points: ChartPoint[]
	ticks: ChartTick[]
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

function niceStep(span: number): number {
	const raw = span / TICK_INTERVALS
	const magnitude = 10 ** Math.floor(Math.log10(raw))
	const step = NICE_STEPS.find((nice) => nice * magnitude >= raw) ?? 10
	return step * magnitude
}

function tickValues(min: number, max: number): number[] {
	if (max === min) return [min]
	const step = niceStep(max - min)
	const first = Math.floor(min / step)
	const last = Math.ceil(max / step)
	return Array.from({ length: last - first + 1 }, (_, index) =>
		Number(((first + index) * step).toPrecision(12))
	)
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
	const tickList = tickValues(min, max)
	const low = tickList[0]
	const valueSpan = tickList[tickList.length - 1] - low
	const first = samples[0]
	const last = samples[samples.length - 1]
	const timeSpan = last.time - first.time
	const drawableHeight = CHART_HEIGHT - CHART_PADDING_Y * 2

	const toY = (value: number) =>
		valueSpan === 0
			? CHART_HEIGHT / 2
			: CHART_PADDING_Y + (1 - (value - low) / valueSpan) * drawableHeight

	const points = samples.map((sample, index) => ({
		...sample,
		x:
			timeSpan === 0
				? (index / (samples.length - 1)) * CHART_WIDTH
				: ((sample.time - first.time) / timeSpan) * CHART_WIDTH,
		y: toY(sample.value),
	}))

	const linePath = toPath(points)

	return {
		points,
		ticks: tickList.map((value) => ({ value, y: toY(value) })),
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
