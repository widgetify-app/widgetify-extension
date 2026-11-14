import { type PointerEvent, useId, useState } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import {
	CHART_HEIGHT,
	CHART_WIDTH,
	type ActivePoint,
	describePoint,
	type PriceChart as PriceChartShape,
	nearestPointIndex,
} from '../utils/build-price-chart'
import { useCurrencyColorMode } from '../hooks/use-currency-color-mode'
import { getChangeColorClass } from '../utils/currency-color-mode'

interface PriceChartProps {
	chart: PriceChartShape
	name: string
	showTime: boolean
	onActiveChange: (point: ActivePoint | null) => void
}

const LABEL_EDGE_PERCENT = 12

function formatMoment(time: number, showTime: boolean): string {
	const date = new Date(time)
	return showTime
		? date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
		: date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
}

export function PriceChart({ chart, name, showTime, onActiveChange }: PriceChartProps) {
	const gradientId = useId()
	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const active = activeIndex === null ? null : chart.points[activeIndex]
	const activePercent = active ? (active.x / CHART_WIDTH) * 100 : 0

	const colorMode = useCurrencyColorMode()
	const trendClass =
		Math.round(chart.changePercentage * 10) === 0
			? 'text-fg-muted'
			: getChangeColorClass(chart.changePercentage > 0 ? 'up' : 'down', colorMode)

	function onPointerMove(event: PointerEvent<HTMLDivElement>) {
		const box = event.currentTarget.getBoundingClientRect()
		if (box.width === 0) return
		const x = ((event.clientX - box.left) / box.width) * CHART_WIDTH
		const index = nearestPointIndex(chart.points, x)
		setActiveIndex(index)
		onActiveChange(describePoint(chart, index))
	}

	function release() {
		setActiveIndex(null)
		onActiveChange(null)
	}

	const lastTick = chart.timeTicks.length - 1

	return (
		<div dir="ltr" className="flex flex-col w-full gap-1.5">
			<div
				aria-hidden="true"
				className="relative h-4 px-5 text-3xs font-bold tabular-nums text-fg-strong"
			>
				{active && (
					<span
						className={cn(
							'absolute top-0 whitespace-nowrap',
							activePercent < LABEL_EDGE_PERCENT
								? 'translate-x-0'
								: activePercent > 100 - LABEL_EDGE_PERCENT
									? '-translate-x-full'
									: '-translate-x-1/2'
						)}
						style={{ left: `${activePercent}%` }}
					>
						{formatMoment(active.time, showTime)}
					</span>
				)}
			</div>

			<div
				role="img"
				aria-label={t('widgets.wigiArz.chart.aria', { name })}
				className={cn('relative w-full touch-none select-none h-33', trendClass)}
				onPointerMove={onPointerMove}
				onPointerLeave={release}
			>
				<svg
					viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
					preserveAspectRatio="none"
					className="absolute inset-0 w-full h-full"
					aria-hidden="true"
				>
					<defs>
						<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
							<stop
								offset="0"
								stopColor="currentColor"
								stopOpacity="0.16"
							/>
							<stop offset="1" stopColor="currentColor" stopOpacity="0" />
						</linearGradient>
					</defs>
					<path d={chart.areaPath} fill={`url(#${gradientId})`} />
					<path
						d={chart.linePath}
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>

				{active && (
					<>
						<span
							aria-hidden="true"
							className="absolute inset-y-0 w-px bg-fg-ghost"
							style={{ left: `${activePercent}%` }}
						/>
						<span
							aria-hidden="true"
							className="absolute block -translate-x-1/2 -translate-y-1/2 rounded-full size-2 bg-current ring-2 ring-surface"
							style={{
								left: `${activePercent}%`,
								top: `${(active.y / CHART_HEIGHT) * 100}%`,
							}}
						/>
					</>
				)}
			</div>

			<div
				aria-hidden="true"
				className="flex justify-between px-5 text-3xs text-fg-faint"
			>
				{chart.timeTicks.map((time, index) =>
					index === lastTick ? (
						<span key={time} className={cn('font-bold', trendClass)}>
							{t('widgets.wigiArz.chart.now')}
						</span>
					) : (
						<span key={time} className="tabular-nums">
							{formatMoment(time, showTime)}
						</span>
					)
				)}
			</div>
		</div>
	)
}
