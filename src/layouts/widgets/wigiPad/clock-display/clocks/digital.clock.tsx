import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'

interface DigitalClockProps {
	time: WidgetifyDate
	isDayTime: boolean
}

export function DigitalClock({ time, isDayTime }: DigitalClockProps) {
	const textColor = isDayTime ? 'text-warning-content' : 'text-primary'

	return (
		<div
			className={`${textColor} text-3xl font-extrabold relative z-10 transition-all duration-300`}
			style={{
				letterSpacing: '0.02em',
			}}
		>
			{time.format('HH:mm')}
		</div>
	)
}
