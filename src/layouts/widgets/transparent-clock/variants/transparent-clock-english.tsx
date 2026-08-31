import { useWallpaperClockTheme } from '../hooks/use-wallpaper-clock-theme'
import { renderDigitSlots } from '../utils/render-digit-slots'

interface TransparentClockEnglishProps {
	time: Date
	hours: string
	minutes: string
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
			className="flex flex-col items-center justify-center w-full h-full min-h-0 pr-2 text-center transition-colors duration-500 font-latin"
			style={{ gap: 'clamp(4px, 2.5cqh, 12px)' }}
		>
			<div
				className="flex items-baseline justify-center font-black leading-none transition-all duration-500"
				style={{
					fontSize: 'clamp(2rem, min(24cqw, 56cqh), 10rem)',
					color: theme.primaryColor,
					textShadow: theme.accentGlow,
				}}
			>
				{renderDigitSlots(hours)}
				<span
					className="opacity-80"
					style={{ fontSize: '0.82em', margin: '0 0.08em' }}
				>
					:
				</span>
				{renderDigitSlots(minutes)}
			</div>

			<div
				className="flex items-center justify-center font-medium transition-all duration-500"
				style={{
					gap: '0.5em',
					fontSize: 'clamp(0.65rem, min(6cqw, 12cqh), 1.75rem)',
					letterSpacing: '0.02em',
					color: theme.secondaryColor,
					textShadow: theme.accentGlow,
				}}
			>
				<span>{weekday}</span>
				<span className="opacity-50" style={{ fontSize: '0.8em' }}>
					•
				</span>
				<span>{gregorianDate}</span>
			</div>
		</div>
	)
}
