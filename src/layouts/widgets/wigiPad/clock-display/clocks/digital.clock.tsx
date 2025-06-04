import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'

interface DigitalClockProps {
	time: WidgetifyDate
	isDayTime: boolean
	timezone: string // e.g. 'TEH' | 'UTC'
}

export function DigitalClock({ time, isDayTime, timezone }: DigitalClockProps) {
	const textColor = isDayTime ? 'text-warning-content' : 'text-primary'

	return (
		<div className="flex flex-col items-center">
			<div
				className={`${textColor} text-3xl font-extrabold relative z-10 transition-all duration-300`}
				style={{
					letterSpacing: '0.02em',
				}}
			>
				{time.format('HH:mm')}
			</div>
			<div
				className={`${textColor} text-sm font-medium opacity-75 mt-1 transition-all duration-300`}
				style={{
					letterSpacing: '0.05em',
				}}
			>
				{timezone}
			</div>
		</div>
	)
}
