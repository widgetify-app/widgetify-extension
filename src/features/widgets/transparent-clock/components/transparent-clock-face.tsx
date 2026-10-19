import type React from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { WidgetMenuButton } from '@/features/widgets/components/widget-menu-button'
import { useWallpaperTheme } from '../../hooks/use-wallpaper-theme'
import type { TransparentClockStyle } from '../types'
import { getClockDigitsPaint, hexToRgbChannels } from '../utils/clock-paint'
import { ClockDigits } from './clock-digits'

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
	clockStyle: TransparentClockStyle
	className?: string
	metaStyle?: React.CSSProperties
	metaDir?: 'ltr'
}

export const TransparentClockFace: React.FC<TransparentClockFaceProps> = ({
	hours,
	minutes,
	weekday,
	date,
	isoDateTime,
	readableTime,
	dateColor,
	clockStyle,
	className,
	metaStyle,
	metaDir,
}) => {
	const theme = useWallpaperTheme()
	const usesWallpaperColors = theme.isDerivedFromWallpaper
	const glow = usesWallpaperColors ? theme.accentGlow : 'none'
	const digits = getClockDigitsPaint(clockStyle, theme, glow)
	const isStacked = clockStyle.face === 'stacked'
	const pickedColor = clockStyle.color.startsWith('#') ? clockStyle.color : null

	const metaColor = pickedColor
		? dateColor === 'primary'
			? pickedColor
			: `rgba(${hexToRgbChannels(pickedColor)}, 0.85)`
		: usesWallpaperColors
			? dateColor === 'primary'
				? theme.primaryColor
				: theme.secondaryColor
			: undefined

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center w-full h-full min-h-0 text-center transition-colors duration-500',
				className
			)}
			style={{ gap: STACK_GAP }}
		>
			<time dateTime={isoDateTime} className="contents">
				<span className="sr-only">
					{readableTime + t('ui.date.headingSep') + weekday + ' ' + date}
				</span>

				<span
					dir="ltr"
					aria-hidden="true"
					className={cn(
						'flex justify-center leading-none transition-[color,text-shadow] duration-500',
						isStacked ? 'flex-col items-center' : 'items-baseline',
						digits.usesThemeText && 'text-fg'
					)}
					style={digits.style}
				>
					{isStacked ? (
						<>
							<span>
								<ClockDigits value={hours} />
							</span>
							<span>
								<ClockDigits value={minutes} />
							</span>
						</>
					) : (
						<>
							<ClockDigits value={hours} />
							<span
								className="opacity-80"
								style={{ fontSize: '0.82em', margin: '0 0.08em' }}
							>
								:
							</span>
							<ClockDigits value={minutes} />
						</>
					)}
				</span>

				{clockStyle.datePosition !== 'hidden' && (
					<span
						dir={metaDir}
						aria-hidden="true"
						className={cn(
							'flex items-center justify-center font-medium transition-[color,text-shadow] duration-500',
							!metaColor && 'text-fg-muted',
							clockStyle.datePosition === 'above' && 'order-first'
						)}
						style={{
							gap: '0.5em',
							fontSize: META_FONT_SIZE,
							color: metaColor,
							textShadow: usesWallpaperColors
								? theme.accentGlow
								: undefined,
							...metaStyle,
						}}
					>
						<span>{weekday}</span>
						<span className="opacity-50" style={{ fontSize: '0.8em' }}>
							•
						</span>
						<span>{date}</span>
					</span>
				)}
			</time>

			<span
				className={cn('absolute top-0 left-0', !usesWallpaperColors && 'text-fg')}
				style={{ color: usesWallpaperColors ? theme.primaryColor : undefined }}
			>
				<WidgetMenuButton placement="corner" tone="onColor" />
			</span>
		</div>
	)
}
