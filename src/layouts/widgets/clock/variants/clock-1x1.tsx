interface Clock1x1Props {
	time: Date
	hours: string
	minutes: string
}

export function Clock1x1({ hours, minutes }: Clock1x1Props) {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center p-1 overflow-hidden select-none">
			<div className="flex flex-col items-center justify-center leading-none text-center">
				<span
					className={`text-2xl sm:text-3xl font-black text-content tracking-tight`}
				>
					{hours}
				</span>
				<div className="w-4 h-0.5 bg-base-content/20 my-1 rounded-full" />
				<span
					className={`text-2xl sm:text-3xl font-black text-content tracking-tight`}
				>
					{minutes}
				</span>
			</div>
		</div>
	)
}
