import type { TooltipRenderProps } from 'react-joyride'
import { Icon } from '@/icons'

export function TourTooltip({
	index,
	isLastStep,
	size,
	step,
	backProps,
	closeProps,
	primaryProps,
	skipProps,
	tooltipProps,
}: TooltipRenderProps) {
	return (
		<div
			{...tooltipProps}
			dir="rtl"
			className="w-[340px] max-w-[calc(100vw-32px)] bg-ds-surface-2 backdrop-blur-md rounded-2xl shadow-2xl border border-ds-line p-4 flex flex-col gap-3.5 text-right select-none"
		>
			<div className="flex items-center justify-between gap-2 border-b border-ds-line pb-2.5">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1">
						{Array.from({ length: size }).map((_, i) => (
							<div
								key={i}
								className={`h-1.5 rounded-full transition-all duration-300 ${
									i === index
										? 'w-5 bg-ds-brand'
										: i < index
											? 'w-1.5 bg-ds-brand-muted'
											: 'w-1.5 bg-ds-fill-3'
								}`}
							/>
						))}
					</div>
					<span className="text-[11px] font-bold text-ds-fg-muted">
						{index + 1} از {size}
					</span>
				</div>

				<button
					type="button"
					{...skipProps}
					className="p-1 transition-colors rounded-lg cursor-pointer text-ds-fg-faint hover:text-ds-fg-strong hover:bg-ds-fill-2"
					title="بستن"
				>
					<Icon name="close" size={14} />
				</button>
			</div>

			<div className="text-xs leading-relaxed text-ds-fg font-medium py-0.5">
				{step.content}
			</div>

			<div className="flex items-center justify-between pt-1 border-t border-ds-line">
				<div>
					{index + 1 > 2 && (
						<button
							type="button"
							{...skipProps}
							className="text-[11px] font-bold text-ds-fg-faint hover:text-ds-fg-strong px-2 py-1.5 rounded-lg hover:bg-ds-fill-2 transition-colors cursor-pointer"
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
							className="text-xs font-bold text-ds-fg-muted hover:text-ds-fg-strong px-3 py-1.5 rounded-xl hover:bg-ds-surface-3 transition-colors cursor-pointer"
						>
							قبلی
						</button>
					)}

					<button
						type="button"
						{...primaryProps}
						className="px-4 py-1.5 rounded-xl bg-ds-brand text-ds-on-brand ring-0! outline-0! font-bold text-xs hover:bg-ds-brand-hover transition-all shadow-md active:scale-95 cursor-pointer"
					>
						{isLastStep ? 'پایان' : 'بعدی'}
					</button>
				</div>
			</div>
		</div>
	)
}
