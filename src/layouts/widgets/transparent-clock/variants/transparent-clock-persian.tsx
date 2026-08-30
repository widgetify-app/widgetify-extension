import { useWallpaperClockTheme } from '../hooks/use-wallpaper-clock-theme'

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
	const theme = useWallpaperClockTheme()
	const weekday = time.toLocaleDateString('fa-IR', { weekday: 'long' })
	const jalaliDate = time.toLocaleDateString('fa-IR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})

	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-1 px-3 text-center transition-colors duration-500">
			<div
				dir="ltr"
				className="text-5xl font-black leading-none tracking-tight transition-all duration-500 sm:text-7xl"
				style={{
					color: theme.primaryColor,
					textShadow: theme.accentGlow,
				}}
			>
				<span>{hours}</span>
				<span className="inline-block mx-0.5">:</span>
				<span>{minutes}</span>
			</div>

			<div
				className="flex items-center justify-center gap-1.5 text-xs font-medium sm:text-sm transition-all duration-500"
				style={{
					color: theme.secondaryColor,
					textShadow: theme.accentGlow,
				}}
			>
				<span>{weekday}</span>
				<span className="opacity-60">•</span>
				<span>{jalaliDate}</span>
			</div>
		</div>
	)
}
