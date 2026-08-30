import { useWallpaperClockTheme } from '../hooks/use-wallpaper-clock-theme'

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
	const theme = useWallpaperClockTheme()
	const weekday = time.toLocaleDateString('en-US', { weekday: 'long' })
	const gregorianDate = time.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})

	return (
		<div
			dir="ltr"
			className="flex flex-col items-center justify-center w-full h-full gap-1 px-3 text-center transition-colors duration-500 font-latin"
		>
			<div
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
				<span>{gregorianDate}</span>
			</div>
		</div>
	)
}
