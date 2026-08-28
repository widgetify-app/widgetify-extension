interface TransparentClockPersianProps {
	time: Date
	hours: string
	minutes: string
	timezoneLabel: string
}

export function TransparentClockPersian({
	time,
	hours,
	minutes,
}: TransparentClockPersianProps) {
	const weekday = time.toLocaleDateString('fa-IR', { weekday: 'long' })
	const jalaliDate = time.toLocaleDateString('fa-IR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})

	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-1 px-3 text-center">
			<div
				dir="ltr"
				className="font-black leading-none tracking-tight text-white text-8xl sm:text-8xl drop-shadow-lg"
			>
				<span>{hours}</span>
				<span className="inline-block mx-0.5">:</span>
				<span>{minutes}</span>
			</div>

			<div className="flex items-center justify-center gap-1.5 text-sm font-medium sm:text-base text-white/95 drop-shadow-md">
				<span>{weekday}</span>
				<span className="opacity-60">•</span>
				<span>{jalaliDate}</span>
			</div>
		</div>
	)
}
