interface Clock2x1Props {
	time: Date
	timezoneLabel: string
	hours: string
	minutes: string
}

export function Clock2x1({ time, timezoneLabel, hours, minutes }: Clock2x1Props) {
	return (
		<div className="w-full h-full flex items-center justify-between px-4 py-2 overflow-hidden select-none">
			<div className="flex items-center gap-3">
				<div className="flex flex-col items-start justify-center">
					<div className="flex items-baseline gap-1.5 leading-none">
						<span
							className="text-3xl sm:text-4xl font-black text-content tracking-tight"
							dir="ltr"
						>
							{hours} : {minutes}
						</span>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-end justify-center text-left pl-1">
				<div className="px-2 py-0.5 rounded-lg bg-base-300/60 text-[11px] text-content font-bold">
					{timezoneLabel}
				</div>
				<span className="text-[10px] text-muted mt-1">
					{time.toLocaleDateString('fa-IR', {
						weekday: 'short',
						month: 'short',
						day: 'numeric',
					})}
				</span>
			</div>
		</div>
	)
}
