import type { TooltipRenderProps } from 'react-joyride'
import { Icon } from '@/src/icons'

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
			className="w-[340px] max-w-[calc(100vw-32px)] bg-base-200/95 backdrop-blur-md rounded-2xl shadow-2xl border border-base-content/15 p-4 flex flex-col gap-3.5 text-right select-none"
		>
			<div className="flex items-center justify-between gap-2 border-b border-base-content/10 pb-2.5">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1">
						{Array.from({ length: size }).map((_, i) => (
							<div
								key={i}
								className={`h-1.5 rounded-full transition-all duration-300 ${
									i === index
										? 'w-5 bg-primary'
										: i < index
											? 'w-1.5 bg-primary/40'
											: 'w-1.5 bg-base-content/20'
								}`}
							/>
						))}
					</div>
					<span className="text-[11px] font-bold text-base-content/60">
						{index + 1} از {size}
					</span>
				</div>

				<button
					type="button"
					{...closeProps}
					className="p-1 transition-colors rounded-lg cursor-pointer text-base-content/50 hover:text-base-content hover:bg-base-content/10"
					title="بستن"
				>
					<Icon name="close" size={14} />
				</button>
			</div>

			<div className="text-xs leading-relaxed text-base-content/90 font-medium py-0.5">
				{step.content}
			</div>

			<div className="flex items-center justify-between pt-1 border-t border-base-content/10">
				<div>
					{index + 1 > 2 && (
						<button
							type="button"
							{...skipProps}
							className="text-[11px] font-bold text-base-content/50 hover:text-base-content px-2 py-1.5 rounded-lg hover:bg-base-content/10 transition-colors cursor-pointer"
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
							className="text-xs font-bold text-base-content/70 hover:text-base-content px-3 py-1.5 rounded-xl hover:bg-base-300 transition-colors cursor-pointer"
						>
							قبلی
						</button>
					)}

					<button
						type="button"
						{...primaryProps}
						className="px-4 py-1.5 rounded-xl bg-primary text-white ring-0! outline-0! font-bold text-xs hover:bg-primary/90 transition-all shadow-md active:scale-95 cursor-pointer"
					>
						{isLastStep ? 'پایان' : 'بعدی'}
					</button>
				</div>
			</div>
		</div>
	)
}
