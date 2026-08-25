interface Clock1x1Props {
	time: Date
	hours: string
	minutes: string
}

export function Clock1x1({ hours, minutes }: Clock1x1Props) {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center p-1 overflow-hidden select-none">
			<div
				dir="ltr"
				className="flex gap-2 items-center justify-center leading-none"
			>
				<span className="text-2xl sm:text-3xl font-black text-content tracking-tight tabular-nums">
					{hours}
				</span>
				<span className="text-2xl sm:text-3xl font-black text-content tracking-tight mx-0.5 -mt-1">
					:
				</span>
				<span className="text-2xl sm:text-3xl font-black text-content tracking-tight tabular-nums">
					{minutes}
				</span>
			</div>
		</div>
	)
}
