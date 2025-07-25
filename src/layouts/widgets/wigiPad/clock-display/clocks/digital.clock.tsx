import type { FetchedTimezone } from '@/services/hooks/timezone/getTimezones.hook'
import type { ClockSettings } from '../clock-display'

interface DigitalClockProps {
	time: Date
	isDayTime: boolean
	timezone: FetchedTimezone
	setting: ClockSettings
}

export function DigitalClock({ time, isDayTime, timezone, setting }: DigitalClockProps) {
	const textColor = isDayTime ? 'text-content' : 'text-primary'
	const hours = (time.getHours()).toString().padStart(2, '0')
	const minutes = time.getMinutes().toString().padStart(2, '0')
	const seconds = time.getSeconds().toString().padStart(2, '0')

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
						let intSeconds = Number.parseInt(seconds)

						const side = Math.floor((i + 7) / 15) // values: 0 ( top right side ), 1 ( right ), 2 ( bottom ), 3 ( left ), 4 ( top left side )
						let x1 = 0
						let x2 = 0
						let y1 = 0
						let y2 = 0
						let differential: number

						switch (side) {
							case 0:
								differential = Math.tan(((i - 30) * 6 * Math.PI) / 180)

								y1 = 10
								if (i === 7) y1 = 11
								x1 = 60 + differential * 50

								y2 = 0
								if (i !== 0) {
									x2 = x1 + differential * 10
								} else {
									x2 = x1
								}

								break
							case 1:
								differential = Math.tan(((15 - i) * 6 * Math.PI) / 180)

								x1 = 109
								y1 = 80 - differential * 70

								x2 = 120
								y2 = y1 - differential * 11

								break
							case 2:
								differential = Math.tan(((i - 30) * 6 * Math.PI) / 180)

								x1 = 60 - differential * 50
								y1 = 150
								if (i === 23 || i === 37) y1 = 149

								x2 = x1 - differential * 10
								y2 = 160

								break
							case 3:
								differential = Math.tan(((i - 45) * 6 * Math.PI) / 180)

								x1 = 11
								y1 = 80 - differential * 70

								x2 = 0
								y2 = y1 - differential * 11

								break
							case 4:
								differential = Math.tan(((i - 30) * 6 * Math.PI) / 180)

								x1 = 60 + Math.tan(((i - 30) * 6 * Math.PI) / 180) * 50
								y1 = 10
								if (i === 53) y1 = 11

								y2 = 0
								x2 = x1 + Math.tan(((i - 30) * 6 * Math.PI) / 180) * 10

								break
						}

						if (i === 0) {
							i = 60
						}

						return (
							<line
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
								key={i}
								stroke="currentColor"
								strokeLinecap="round"
								strokeWidth="2"
								// strokeWidth={i % 5 === 0 ? "3" : "2"}
								opacity={
									intSeconds - i >= 0
										? (60 - Math.abs(intSeconds - 1 - i)) / 60
										: (i - intSeconds + 1) / 60
								}
								className={`transition-all duration-1000 ease-linear ${textColor}`}
							/>
						)
					})}
				</svg>
			)}
			<div
				className={`${textColor} absolute top-1/2 ${
					setting.showSeconds
						? `inset-x-5 ${setting.showTimeZone ? '-translate-y-[calc(50%+0.625rem)]' : '-translate-y-[calc(50%+0.1rem)]'} text-[3rem]`
						: `${setting.showTimeZone ? '-translate-y-[calc(50%+0.9rem)]' : '-translate-y-[calc(50%)]'} text-[3.4rem]`
				} w-[calc(100%-2.5rem)] flex flex-col items-center text-center leading-none drop-shadow-md font-sans font-black z-10 transition-all duration-300`}
			>
				<span>{hours}</span>
				<span>{minutes}</span>
			</div>
			{setting.showTimeZone && (
				<div
					className={`${textColor} absolute bottom-[1.3rem] ${setting.showSeconds ? 'inset-x-5 w-[calc(100%-2.5rem)] text-xs' : 'translate-y-20 text-sm'} leading-none font-medium tracking-[0.05em] text-center truncate opacity-90 transition-all duration-300`}
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
