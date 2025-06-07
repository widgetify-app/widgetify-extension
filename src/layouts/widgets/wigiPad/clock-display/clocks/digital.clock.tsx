import type { FetchedTimezone } from '@/services/hooks/timezone/getTimezones.hook'
import type { ClockSettings } from '../clock-display'

interface DigitalClockProps {
	time: Date
	isDayTime: boolean
	timezone: FetchedTimezone
	setting: ClockSettings
}

export function DigitalClock({ time, isDayTime, timezone, setting }: DigitalClockProps) {
	const textColor = isDayTime ? 'text-warning/90' : 'text-primary'

	const options: Intl.DateTimeFormatOptions = {
		timeZone: timezone.value,
		hour12: false,
		hour: 'numeric',
		minute: '2-digit',
	}

	if (setting.showSeconds) {
		options.second = '2-digit'
	}

	let timeString = new Intl.DateTimeFormat('en-US', options).format(time)

	const [hours, ...rest] = timeString.split(':')
	const formattedHours = hours === '24' ? '00' : hours.padStart(2, '0')
	timeString = [formattedHours, ...rest].join(':')

	return (
		<div className="flex flex-col items-center">
			<div
				className={`${textColor} text-2xl font-extrabold relative z-10 transition-all duration-300`}
				style={{
					letterSpacing: '0.02em',
					textAlign: 'center',
				}}
			>
				{timeString}
			</div>
			{setting.showTimeZone && (
				<div
					className={`${textColor} text-sm font-medium opacity-75 mt-1 transition-all duration-300`}
					style={{
						letterSpacing: '0.05em',
					}}
				>
					{getTimeZoneLabel(timezone.label)}
				</div>
			)}
		</div>
	)
}

function getTimeZoneLabel(timezone: string): string {
	if (timezone.length === 3) {
		return timezone
	}

	if (timezone.split('/')[1]) {
		return timezone.split('/')[1].replace('_', ' ').toUpperCase()
	}

	return timezone
}
