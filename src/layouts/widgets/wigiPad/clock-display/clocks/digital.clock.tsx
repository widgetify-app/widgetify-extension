import type { FetchedTimezone } from '@/services/hooks/timezone/getTimezones.hook'
import type { ClockSettings } from '../clock-setting.interface'
import { GetTimeInZone } from '../shared'

interface DigitalClockProps {
	timezone: FetchedTimezone
	setting: ClockSettings
}

export function DigitalClock({ timezone, setting }: DigitalClockProps) {
	const [time, setTime] = useState(GetTimeInZone(timezone.value))
	useEffect(() => {
		const timer = setInterval(() => {
			setTime(GetTimeInZone(timezone.value))
		}, 1000)
		return () => clearInterval(timer)
	}, [timezone])

	const hours = time.getHours().toString().padStart(2, '0')
	const minutes = time.getMinutes().toString().padStart(2, '0')
	const seconds = time.getSeconds().toString().padStart(2, '0')

	const isDayTime = time.getHours() >= 6 && time.getHours() < 18

	const textColor = useMemo(
		() => (isDayTime ? 'text-content' : 'text-primary'),
		[isDayTime]
	)

	const getFontTranslateClass = () => {
		return setting.useSelectedFont
			? '-translate-y-[calc(50%+0.200rem)]'
			: '-translate-y-[calc(50%+0.9rem)]'
	}

	const digitalClockStyles = useMemo(() => {
		if (setting.showSeconds) {
			return `inset-x-5 ${setting.showTimeZone ? getFontTranslateClass() : '-translate-y-[calc(50%+0.1rem)]'} text-5xl`
		}
		return `${setting.showTimeZone ? '-translate-y-[calc(50%+0.9rem)]' : '-translate-y-[calc(50%)]'} text-[3.4rem]`
	}, [setting.showSeconds, setting.showTimeZone])

	const clockWidth = useMemo(
		() => (setting.showSeconds ? 'w-[calc(100%-2.8rem)]' : 'w-[calc(100%-2.5rem)]'),
		[setting.showSeconds]
	)

	const timeZoneStyles = useMemo(
		() =>
			setting.showSeconds
				? 'inset-x-5 w-[calc(100%-2.5rem)] text-xs'
				: 'translate-y-20 text-sm',
		[setting.showSeconds]
	)

	const timezoneLabel = useMemo(
		() => getTimeZoneLabel(timezone.label),
		[timezone.label]
	)

	return (
		<div className="relative flex flex-col items-center">
			{setting.showSeconds && (
				<svg
					width="120"
					height="160"
					viewBox="-1 -1 123 164"
					className="w-full h-[9rem]"
				>
					{[...Array(60)].map((_, i) => {
						const intSeconds = Number.parseInt(seconds, 10)
						const side = Math.floor((i + 7) / 15) // values: 0-4 representing different sides
						let x1 = 0,
							x2 = 0,
							y1 = 0,
							y2 = 0
						let differential: number

						switch (side) {
							case 0: // top right side
								differential = Math.tan(((i - 30) * 6 * Math.PI) / 180)
								y1 = i === 7 ? 11 : 10
								x1 = 60 + differential * 50
								y2 = 0
								x2 = i !== 0 ? x1 + differential * 10 : x1
								break
							case 1: // right
								differential = Math.tan(((15 - i) * 6 * Math.PI) / 180)
								x1 = 109
								y1 = 80 - differential * 70
								x2 = 120
								y2 = y1 - differential * 11
								break
							case 2: // bottom
								differential = Math.tan(((i - 30) * 6 * Math.PI) / 180)
								x1 = 60 - differential * 50
								y1 = i === 23 || i === 37 ? 149 : 150
								x2 = x1 - differential * 10
								y2 = 160
								break
							case 3: // left
								differential = Math.tan(((i - 45) * 6 * Math.PI) / 180)
								x1 = 11
								y1 = 80 - differential * 70
								x2 = 0
								y2 = y1 - differential * 11
								break
							case 4: // top left side
								differential = Math.tan(((i - 30) * 6 * Math.PI) / 180)
								x1 = 60 + differential * 50
								y1 = i === 53 ? 11 : 10
								y2 = 0
								x2 = x1 + differential * 10
								break
						}

						const index = i === 0 ? 60 : i
						const opacity =
							intSeconds - index >= 0
								? (60 - Math.abs(intSeconds - 1 - index)) / 60
								: (index - intSeconds + 1) / 60

						return (
							<line
								key={index}
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
								stroke="currentColor"
								strokeLinecap="round"
								strokeWidth="2"
								opacity={opacity}
								className={`transition-all duration-1000 ease-linear ${textColor}`}
							/>
						)
					})}
				</svg>
			)}
			<div
				className={`${textColor} absolute top-1/2 ${digitalClockStyles} ${clockWidth} 
				flex flex-col items-center text-center leading-none ${!setting.useSelectedFont && 'font-sans'} 
				font-black drop-shadow-md z-10 transition-all duration-300`}
			>
				<span>{hours}</span>
				<span>{minutes}</span>
			</div>
			{setting.showTimeZone && (
				<div
					className={`${textColor} absolute bottom-[1.3rem] ${timeZoneStyles} 
					leading-none font-medium tracking-[0.05em] text-center truncate opacity-90 transition-all duration-300`}
				>
					{timezoneLabel}
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
