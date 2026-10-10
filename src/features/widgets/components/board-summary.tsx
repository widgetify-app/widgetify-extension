import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'

const RING_RADIUS = 15.9155

interface BoardStat {
	label: string
	value: number
	className?: string
}

interface BoardSummaryProps {
	label: string
	percent: number
	percentLabel: string
	caption?: string
	stats: BoardStat[]
	placement?: 'side' | 'top'
}

export function BoardSummary({
	label,
	percent,
	percentLabel,
	caption,
	stats,
	placement = 'side',
}: BoardSummaryProps) {
	const isTop = placement === 'top'

	return (
		<aside
			aria-label={label}
			className={cn(
				'flex flex-none border-line',
				isTop
					? 'items-center gap-4 px-2 pb-3 border-b'
					: 'flex-col gap-1 pt-1 border-s w-37.5 ps-3.5'
			)}
		>
			<div
				role="img"
				aria-label={percentLabel}
				className={cn(
					'relative grid place-items-center',
					isTop ? 'shrink-0 size-15' : 'self-center mt-1 mb-2.5 size-19'
				)}
			>
				<svg
					aria-hidden="true"
					className="absolute inset-0 -rotate-90 size-full"
					viewBox="0 0 36 36"
				>
					<circle
						className="text-fill-2"
						stroke="currentColor"
						strokeWidth="3"
						fill="none"
						cx="18"
						cy="18"
						r={RING_RADIUS}
					/>
					<circle
						className="transition-[stroke-dasharray] duration-500 ease-out text-brand"
						stroke="currentColor"
						strokeWidth="3"
						strokeDasharray={`${percent}, 100`}
						strokeLinecap="round"
						fill="none"
						cx="18"
						cy="18"
						r={RING_RADIUS}
					/>
				</svg>
				<span className="relative flex flex-col items-center leading-control">
					<span
						className={cn(
							'font-bold tabular-nums text-fg-strong',
							isTop ? 'text-sm' : 'text-base'
						)}
					>
						{t('widgets.shell.percent', { percent })}
					</span>
					{caption && <span className="text-3xs text-fg-faint">{caption}</span>}
				</span>
			</div>

			<dl className={cn('flex flex-col', isTop && 'flex-1 min-w-0')}>
				{stats.map((stat) => (
					<div
						key={stat.label}
						className={cn(
							'flex items-center justify-between text-xs text-fg-muted',
							isTop ? 'h-6' : 'h-6.5'
						)}
					>
						<dt>{stat.label}</dt>
						<dd
							className={cn(
								'text-sm font-bold tabular-nums text-fg-strong',
								stat.className
							)}
						>
							<data value={stat.value}>{stat.value}</data>
						</dd>
					</div>
				))}
			</dl>
		</aside>
	)
}
