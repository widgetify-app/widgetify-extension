import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'

interface DigitalClockProps {
	time: WidgetifyDate
	isDayTime: boolean
	timezone: string // e.g. 'TEH' | 'UTC'
}

export function DigitalClock({ time, isDayTime, timezone }: DigitalClockProps) {
	const textColor = isDayTime ? 'text-warning/90' : 'text-primary'

	return (
		<div className="flex flex-col items-center">
			{' '}
			<div
				className={`${textColor} text-2xl font-extrabold relative z-10 transition-all duration-300`}
				style={{
					letterSpacing: '0.02em',
					textAlign: 'center',
				}}
			>
				{time.format('HH:mm:ss')}
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
