import type { TooltipRenderProps } from 'react-joyride'
import { Icon } from '@/icons'

export function TourTooltip({
	index,
	isLastStep,
	size,
	step,
	backProps,
	primaryProps,
	skipProps,
	tooltipProps,
}: TooltipRenderProps) {
	return (
		<div
			{...tooltipProps}
			dir="rtl"
			className="w-[340px] max-w-[calc(100vw-32px)] bg-surface-2 backdrop-blur-md rounded-2xl shadow-xl border border-line p-4 flex flex-col gap-3.5 text-right select-none"
		>
			<div className="flex items-center justify-between gap-2 border-b border-line pb-2.5">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1">
						{Array.from({ length: size }).map((_, i) => (
							<div
								key={i}
								className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
									i === index
										? 'w-5 bg-brand'
										: i < index
											? 'w-1.5 bg-brand-muted'
											: 'w-1.5 bg-fill-3'
								}`}
							/>
						))}
					</div>
					<span className="text-2xs font-bold text-fg-muted">
						{index + 1} از {size}
					</span>
				</div>

				<button
					type="button"
					{...skipProps}
					className="p-1 transition-colors rounded-lg cursor-pointer text-fg-faint hover:text-fg-strong hover:bg-fill-2"
					title="بستن"
				>
					<Icon name="close" size={14} />
				</button>
			</div>

			<div className="text-xs leading-relaxed text-fg font-medium py-0.5">
				{step.content}
			</div>

			<div className="flex items-center justify-between pt-1 border-t border-line">
				<div>
					{index + 1 > 2 && (
						<button
							type="button"
							{...skipProps}
							className="text-2xs font-bold text-fg-faint hover:text-fg-strong px-2 py-1.5 rounded-lg hover:bg-fill-2 transition-colors cursor-pointer"
						>
							رد کردن
						</button>
					)}
				</div>

				<div className="flex items-center gap-1.5">
					{index > 0 && (
						<button
							type="button"
							{...backProps}
							className="text-xs font-bold text-fg-muted hover:text-fg-strong px-3 py-1.5 rounded-xl hover:bg-surface-3 transition-colors cursor-pointer"
						>
							قبلی
						</button>
					)}

					<button
						type="button"
						{...primaryProps}
						className="px-4 py-1.5 rounded-xl bg-brand text-on-brand ring-0! outline-0! font-bold text-xs hover:bg-brand-hover transition-ui shadow-md active:scale-95 cursor-pointer"
					>
						{isLastStep ? 'پایان' : 'بعدی'}
					</button>
				</div>
			</div>
		</div>
	)
}
