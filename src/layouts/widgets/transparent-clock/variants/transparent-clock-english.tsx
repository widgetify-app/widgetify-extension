interface TransparentClockEnglishProps {
	time: Date
	hours: string
	minutes: string
	timezoneLabel: string
}

export function TransparentClockEnglish({
	time,
	hours,
	minutes,
}: TransparentClockEnglishProps) {
	const weekday = time.toLocaleDateString('en-US', { weekday: 'long' })
	const gregorianDate = time.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})

	return (
		<div
			dir="ltr"
			className="flex flex-col items-center justify-center w-full h-full gap-1 px-3 text-center font-latin"
		>
			<div className="text-6xl font-black leading-none tracking-tight text-white sm:text-9xl drop-shadow-lg">
				<span>{hours}</span>
				<span className="inline-block mx-0.5">:</span>
				<span>{minutes}</span>
			</div>

			<div className="flex items-center justify-center gap-1.5 text-sm font-medium sm:text-base text-white/95 drop-shadow-md">
				<span>{weekday}</span>
				<span className="opacity-60">•</span>
				<span>{gregorianDate}</span>
			</div>
		</div>
	)
}
