import type React from 'react'
import { cn } from '@/common/utils/cn'
import { useWallpaperClockTheme } from '../hooks/use-wallpaper-clock-theme'
import { ClockDigits } from './clock-digits'

const CLOCK_FONT_SIZE = 'clamp(2rem, min(24cqw, 56cqh), 10rem)'
const META_FONT_SIZE = 'clamp(0.65rem, min(6cqw, 12cqh), 1.75rem)'
const STACK_GAP = 'clamp(4px, 2.5cqh, 12px)'

interface TransparentClockFaceProps {
	hours: string
	minutes: string
	weekday: string
	date: string
	isoDateTime: string
	readableTime: string
	dateColor: 'primary' | 'secondary'
	className?: string
	style?: React.CSSProperties
	metaStyle?: React.CSSProperties
}

export const TransparentClockFace: React.FC<TransparentClockFaceProps> = ({
	hours,
	minutes,
	weekday,
	date,
	isoDateTime,
	readableTime,
	dateColor,
	className,
	metaStyle,
}) => {
	const theme = useWallpaperClockTheme()
	const usesWallpaperColors = theme.isDerivedFromWallpaper

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center w-full h-full min-h-0 text-center transition-colors duration-500',
				className
			)}
			style={{ gap: STACK_GAP }}
		>
			<time dateTime={isoDateTime} className="contents">
				<span className="sr-only">{`${readableTime}، ${weekday} ${date}`}</span>

				<span
					dir="ltr"
					aria-hidden="true"
					className={cn(
						'flex items-baseline justify-center font-black leading-none transition-[color,text-shadow] duration-500',
						!usesWallpaperColors && 'text-content'
					)}
					style={{
						fontSize: CLOCK_FONT_SIZE,
						color: usesWallpaperColors ? theme.primaryColor : undefined,
						textShadow: usesWallpaperColors ? theme.accentGlow : undefined,
					}}
				>
					<ClockDigits value={hours} />
					<span
						className="opacity-80"
						style={{ fontSize: '0.82em', margin: '0 0.08em' }}
					>
						:
					</span>
					<ClockDigits value={minutes} />
				</span>

				<span
					aria-hidden="true"
					className={cn(
						'flex items-center justify-center font-medium transition-[color,text-shadow] duration-500',
						!usesWallpaperColors && 'text-muted'
					)}
					style={{
						gap: '0.5em',
						fontSize: META_FONT_SIZE,
						color: usesWallpaperColors
							? dateColor === 'primary'
								? theme.primaryColor
								: theme.secondaryColor
							: undefined,
						textShadow: usesWallpaperColors ? theme.accentGlow : undefined,
						...metaStyle,
					}}
				>
					<span>{weekday}</span>
					<span className="opacity-50" style={{ fontSize: '0.8em' }}>
						•
					</span>
					<span>{date}</span>
				</span>
			</time>
		</div>
	)
}
