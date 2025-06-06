import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'
import type { ClockSettings } from '../clock-display'

interface AnalogClockProps {
	time: WidgetifyDate
	isDayTime: boolean
	timezone: string
	setting: ClockSettings
}

export function AnalogClock({ time, isDayTime, timezone, setting }: AnalogClockProps) {
	const hours = time.hour() % 12
	const minutes = time.minute()
	const seconds = time.second()

	const hourAngle = hours * 30 + minutes * 0.5
	const minuteAngle = minutes * 6
	const secondAngle = seconds * 6

	const textColor = isDayTime ? 'text-warning' : 'text-primary'
	const handColor = isDayTime ? '#f59e0b' : '#3b82f6'

	return (
		<div className="relative flex flex-col items-center justify-center">
			{/* Analog Clock */}
			<div className="relative w-24 h-24 mb-2">
				<svg
					width="96"
					height="96"
					viewBox="0 0 96 96"
					className="transform -rotate-90"
				>
					{/* Clock face */}
					<circle
						cx="48"
						cy="48"
						r="46"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className={textColor}
						opacity="0.3"
					/>
					{/* Hour markers */}
					{[...Array(12)].map((_, i) => {
						const angle = i * 30
						const isMainHour = i % 3 === 0
						const x1 =
							48 +
							(isMainHour ? 35 : 38) *
								Math.cos(((angle - 90) * Math.PI) / 180)
						const y1 =
							48 +
							(isMainHour ? 35 : 38) *
								Math.sin(((angle - 90) * Math.PI) / 180)
						const x2 = 48 + 42 * Math.cos(((angle - 90) * Math.PI) / 180)
						const y2 = 48 + 42 * Math.sin(((angle - 90) * Math.PI) / 180)

						return (
							<line
								key={i}
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
								stroke={handColor}
								strokeWidth={isMainHour ? '2' : '1'}
								opacity={isMainHour ? '0.8' : '0.4'}
							/>
						)
					})}
					{/* Hour hand */}
					<line
						x1="48"
						y1="48"
						x2={48 + 20 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
						y2={48 + 20 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
						stroke={handColor}
						strokeWidth="3"
						strokeLinecap="round"
					/>
					{/* Minute hand */}
					<line
						x1="48"
						y1="48"
						x2={48 + 30 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
						y2={48 + 30 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
						stroke={handColor}
						strokeWidth="2"
						strokeLinecap="round"
					/>
					{/* Second hand */}
					{setting.showSeconds && (
						<line
							x1="48"
							y1="48"
							x2={48 + 32 * Math.cos(((secondAngle - 90) * Math.PI) / 180)}
							y2={48 + 32 * Math.sin(((secondAngle - 90) * Math.PI) / 180)}
							stroke="#ef4444"
							strokeWidth="1"
							strokeLinecap="round"
							className="transition-transform duration-75 ease-linear"
						/>
					)}
					{/* Center dot */}
					<circle cx="48" cy="48" r="3" fill={handColor} />
				</svg>

				{/* Timezone display in the center */}
				{setting.showTimeZone && (
					<div className="absolute inset-0 flex items-center justify-center">
						<span
							className={`text-xs font-medium ${textColor}`}
							style={{
								marginTop: '1.5rem',
								textAlign: 'center',
								fontSize: '10px',
							}}
						>
							{timezone.slice(0, 3).toUpperCase()}
						</span>
					</div>
				)}
			</div>
		</div>
	)
}
