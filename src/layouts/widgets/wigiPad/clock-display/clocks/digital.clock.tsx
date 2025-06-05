import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'
import type { ClockSettings } from '../clock-display'

interface DigitalClockProps {
	time: WidgetifyDate
	isDayTime: boolean
	timezone: string // e.g. 'TEH' | 'UTC'
	setting: ClockSettings
}

export function DigitalClock({ time, isDayTime, timezone, setting }: DigitalClockProps) {
	const textColor = isDayTime ? 'text-warning/90' : 'text-primary'
	return (
		<div className="flex flex-col items-center">
			<div
				className={`${textColor} text-2xl font-extrabold relative z-10 transition-all duration-300`}
				style={{
					letterSpacing: '0.02em',
					textAlign: 'center',
				}}
			>
				{setting.showSeconds ? time.format('HH:mm:ss') : time.format('HH:mm')}
			</div>
			{setting.showTimeZone && (
				<div
					className={`${textColor} text-sm font-medium opacity-75 mt-1 transition-all duration-300`}
					style={{
						letterSpacing: '0.05em',
					}}
				>
					{timezone}
				</div>
			)}
		</div>
	)
}
