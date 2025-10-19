import type { FetchedTimezone } from '@/services/hooks/timezone/getTimezones.hook'
import type { ClockSettings } from '../clock-setting.interface'

interface AnalogClockProps {
	timezone: FetchedTimezone
	setting: ClockSettings
}

export function AnalogClock({ timezone, setting }: AnalogClockProps) {
	const [time, setTime] = useState(
		new Date(new Date().toLocaleString('en-US', { timeZone: timezone.value }))
	)

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(
				new Date(new Date().toLocaleString('en-US', { timeZone: timezone.value }))
			)
		}, 1000)
		return () => clearInterval(timer)
	}, [timezone])

	const hours = time.getHours() % 12
	const minutes = time.getMinutes()
	const seconds = time.getSeconds()

	const handColor = 'currentColor'
	const timezoneLabel = useMemo(() => getTimeZoneLabel(timezone), [timezone])

	const hourAngle = useMemo(() => hours * 30 + minutes * 0.5, [hours, minutes])
	const minuteAngle = useMemo(() => minutes * 6, [minutes])
	const secondAngle = useMemo(() => seconds * 6, [seconds])

	const hourMarkers = useMemo(() => {
		return Array.from({ length: 12 }, (_, i) => {
			const angle = i * 30
			const isMain = i % 3 === 0
			const innerRadius = isMain ? 35 : 38
			const outerRadius = 85

			const x1 = 60 + innerRadius * Math.cos(((angle - 90) * Math.PI) / 180)
			const y1 = 60 + innerRadius * Math.sin(((angle - 90) * Math.PI) / 180)
			const x2 = 60 + outerRadius * Math.cos(((angle - 90) * Math.PI) / 180)
			const y2 = 60 + outerRadius * Math.sin(((angle - 90) * Math.PI) / 180)

			return { x1, y1, x2, y2, isMain }
		})
	}, [])

	return (
		<div className="relative flex flex-col items-center justify-center">
			<div className="relative w-[7.5rem] h-[7.5rem]">
				<svg width="120" height="120" viewBox="0 0 120 120">
					{hourMarkers.map(({ x1, y1, x2, y2, isMain }, i) => (
						<line
							key={i}
							x1={x1}
							y1={y1}
							x2={x2}
							y2={y2}
							stroke={handColor}
							strokeWidth={isMain ? '2' : '1'}
							opacity={isMain ? '0.8' : '0.4'}
						/>
					))}

					{/* Hour hand */}
					<line
						x1="60"
						y1="60"
						x2={60 + 30 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
						y2={60 + 30 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
						stroke="currentColor"
						strokeWidth="8"
						strokeLinecap="round"
						className="transition-transform duration-300 ease-out"
					/>

					{/* Minute hand */}
					<line
						x1="60"
						y1="60"
						x2={60 + 50 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
						y2={60 + 50 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
						strokeWidth="4"
						className="transition-transform duration-300 ease-out stroke-gray-400"
						strokeLinecap="round"
					/>

					{/* Second hand */}
					{setting.showSeconds && (
						<>
							<line
								x1="60"
								y1="60"
								x2={
									60 +
									30 * Math.cos(((secondAngle - 90) * Math.PI) / 180)
								}
								y2={
									60 +
									30 * Math.sin(((secondAngle - 90) * Math.PI) / 180)
								}
								stroke={handColor}
								strokeWidth="2"
								strokeLinecap="round"
								className="transition-transform duration-200 ease-out"
							/>
							<circle cx="60" cy="60" r="2" fill={handColor} />
						</>
					)}
				</svg>

				{/* Timezone label */}
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
							{timezoneLabel}
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
