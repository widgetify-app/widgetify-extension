import type { FetchedTimezone } from '@/services/hooks/timezone/getTimezones.hook'
import type { ClockSettings } from '../clock-display'

interface AnalogClockProps {
	time: Date
	isDayTime: boolean
	timezone: FetchedTimezone
	setting: ClockSettings
}

export function AnalogClock({ time, isDayTime, timezone, setting }: AnalogClockProps) {
	const hours = time.getHours() % 12
	const minutes = time.getMinutes()
	const seconds = time.getSeconds()

	const hourAngle = hours * 30 + minutes * 0.5
	const minuteAngle = minutes * 6
	const secondAngle = seconds * 6

	const handColor = isDayTime ? 'currentColor' : '#3b82f6'

	return (
		<div className="relative flex flex-col items-center justify-center">
			{/* Analog Clock */}
			<div className="relative p-2 w-[7.5rem] h-[9.5rem]">
				<svg width="120" height="144" viewBox="0 0 120 144" className='w-full h-full'>
					{/* Hour markers */}
					{[...Array(12)].map((_, i) => {
						const angle = i * 30
						const isMainHour = i % 3 === 0
						const x1 =
							60 + 
							(isMainHour ? 35 : 38) *
								Math.cos(((angle - 90) * Math.PI) / 180)
						const y1 =
							72 +
							(isMainHour ? 35 : 38) *
								Math.sin(((angle - 90) * Math.PI) / 180)
						const x2 = 60 + 90 * Math.cos(((angle - 90) * Math.PI) / 180) 
						const y2 = 72 + 90 * Math.sin(((angle - 90) * Math.PI) / 180)

						return (
							<line
								key={i}
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
								stroke={handColor}
								strokeLinecap="round"
								strokeWidth={isMainHour ? '3' : '2'}
								opacity={isMainHour ? '0.75' : '0.25'}
							/>
						)
					})}
					{/* Hour hand */}
					<line
						x1="60"
						y1="72"
						x2={60 + 30 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
						y2={72 + 30 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
						stroke={'currentColor'}
						strokeWidth="8"
						strokeLinecap="round"
					/>
					{/* Minute hand */}
					<line
						x1="60"
						y1="72"
						x2={60 + 50 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
						y2={72 + 50 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
						strokeWidth="4.5"
						className="stroke-gray-400"
						strokeLinecap="round"
					/>
					{setting.showSeconds && (
						<>
							{/* Second hand */}
							<line
								x1="60"
								y1="72"
								x2={
									60 +
									30 * Math.cos(((secondAngle - 90) * Math.PI) / 180)
								}
								y2={
									72 +
									30 * Math.sin(((secondAngle - 90) * Math.PI) / 180)
								}
								stroke={handColor}
								strokeWidth="2"
								strokeLinecap="round"
								className="transition-transform duration-75 ease-linear"
							/>
							{/* Center dot */}
							<circle cx="60" cy="72" r="2" fill={handColor} />
						</>
					)}
				</svg>

				{/* Timezone display in the center */}
				{setting.showTimeZone && (
					<div className="absolute inset-0 flex items-center justify-center">
						<span
							className="text-xs font-medium text-content"
							style={{
								marginTop: '2rem',
								textAlign: 'center',
								fontSize: '10px',
							}}
						>
							{getTimeZoneLabel(timezone)}
						</span>
					</div>
				)}
			</div>
		</div>
	)
}

function getTimeZoneLabel(timezone: FetchedTimezone): string {
	if (!timezone.value) {
		return 'UTC'
	}

	const parts = timezone.value.split('/')
	if (parts.length > 1) {
		const city = parts[1].replace(/_/g, ' ')
		return city.slice(0, 3).toUpperCase()
	}
	return timezone.value.slice(0, 3).toUpperCase()
}
