import { type PointerEvent, useId, useState } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import {
	CHART_HEIGHT,
	CHART_WIDTH,
	type PriceChart as PriceChartShape,
	nearestPointIndex,
} from '../utils/build-price-chart'
import { useCurrencyColorMode } from '../hooks/use-currency-color-mode'
import { getChangeColorClass } from '../utils/currency-color-mode'
import { PriceChange } from './price-change'

interface PriceChartProps {
	chart: PriceChartShape
	name: string
	showTime: boolean
}

const TOOLTIP_EDGE_PERCENT = 22

function formatMoment(time: number, showTime: boolean): string {
	const date = new Date(time)
	return showTime
		? date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
		: date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
}

export function PriceChart({ chart, name, showTime }: PriceChartProps) {
	const gradientId = useId()
	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const active = activeIndex === null ? null : chart.points[activeIndex]
	const last = chart.points[chart.points.length - 1]
	const first = chart.points[0]

	const colorMode = useCurrencyColorMode()
	const trendClass =
		Math.round(chart.changePercentage * 10) === 0
			? 'text-fg-muted'
			: getChangeColorClass(chart.changePercentage > 0 ? 'up' : 'down', colorMode)

	function onPointerMove(event: PointerEvent<HTMLDivElement>) {
		const box = event.currentTarget.getBoundingClientRect()
		if (box.width === 0) return
		const x = ((event.clientX - box.left) / box.width) * CHART_WIDTH
		setActiveIndex(nearestPointIndex(chart.points, x))
	}

	return (
		<div dir="ltr" className={cn('flex flex-col w-full gap-1.5', trendClass)}>
			<div className="flex items-center justify-between gap-2 text-3xs text-fg-faint">
				<span>
					{t('widgets.wigiArz.chart.high')}{' '}
					<span className="font-bold tabular-nums text-fg-muted">
						{chart.max.toLocaleString()}
					</span>
				</span>
				<PriceChange changePercentage={chart.changePercentage} />
				<span>
					{t('widgets.wigiArz.chart.low')}{' '}
					<span className="font-bold tabular-nums text-fg-muted">
						{chart.min.toLocaleString()}
					</span>
				</span>
			</div>

			<div
				role="img"
				aria-label={t('widgets.wigiArz.chart.aria', { name })}
				className="relative w-full touch-none select-none h-30"
				onPointerMove={onPointerMove}
				onPointerLeave={() => setActiveIndex(null)}
			>
				<svg
					viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
					preserveAspectRatio="none"
					className="absolute inset-0 w-full h-full overflow-visible"
					aria-hidden="true"
				>
					<defs>
						<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
							<stop
								offset="0"
								stopColor="currentColor"
								stopOpacity="0.28"
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

				<span
					aria-hidden="true"
					className="absolute block -translate-x-1/2 -translate-y-1/2 rounded-full size-2 bg-current ring-2 ring-surface"
					style={{
						left: `${((active ?? last).x / CHART_WIDTH) * 100}%`,
						top: `${((active ?? last).y / CHART_HEIGHT) * 100}%`,
					}}
				/>

				{active && (
					<>
						<span
							aria-hidden="true"
							className="absolute inset-y-0 w-px bg-fg-ghost"
							style={{ left: `${(active.x / CHART_WIDTH) * 100}%` }}
						/>
						<output
							className={cn(
								'absolute px-2 py-1 text-center rounded-lg pointer-events-none -top-1 -translate-y-full bg-surface-3 text-fg-strong text-3xs whitespace-nowrap',
								(active.x / CHART_WIDTH) * 100 < TOOLTIP_EDGE_PERCENT
									? 'translate-x-0'
									: (active.x / CHART_WIDTH) * 100 >
											100 - TOOLTIP_EDGE_PERCENT
										? '-translate-x-full'
										: '-translate-x-1/2'
							)}
							style={{ left: `${(active.x / CHART_WIDTH) * 100}%` }}
						>
							<span className="block font-bold tabular-nums">
								{active.value.toLocaleString()}
							</span>
							<span className="block text-fg-muted">
								{formatMoment(active.time, showTime)}
							</span>
						</output>
					</>
				)}
			</div>

			<div className="flex items-center justify-between text-3xs text-fg-faint">
				<span>{formatMoment(first.time, showTime)}</span>
				<span>{formatMoment(last.time, showTime)}</span>
			</div>
		</div>
	)
}
