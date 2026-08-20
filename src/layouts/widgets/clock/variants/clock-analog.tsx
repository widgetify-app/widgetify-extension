import { useEffect, useMemo, useState } from 'react'
import { useDate } from '@/context/date.context'

interface ClockAnalogProps {
	size?: number
	time?: Date
}

export function ClockAnalog({ size = 76, time: propTime }: ClockAnalogProps) {
	const { today } = useDate()
	const [internalTime, setInternalTime] = useState<Date>(() => today.toDate())

	useEffect(() => {
		if (propTime) return
		const timer = setInterval(() => {
			setInternalTime(new Date())
		}, 1000)
		return () => clearInterval(timer)
	}, [propTime])

	const time = propTime || internalTime

	const hours = time.getHours() % 12
	const minutes = time.getMinutes()
	const seconds = time.getSeconds()

	const hourAngle = hours * 30 + minutes * 0.5
	const minuteAngle = minutes * 6
	const secondAngle = seconds * 6

	const hourMarkers = useMemo(() => {
		return Array.from({ length: 12 }, (_, i) => {
			const angle = i * 30
			const isMain = i % 3 === 0
			const innerRadius = isMain ? 32 : 36
			const outerRadius = 42

			const x1 = 50 + innerRadius * Math.cos(((angle - 90) * Math.PI) / 180)
			const y1 = 50 + innerRadius * Math.sin(((angle - 90) * Math.PI) / 180)
			const x2 = 50 + outerRadius * Math.cos(((angle - 90) * Math.PI) / 180)
			const y2 = 50 + outerRadius * Math.sin(((angle - 90) * Math.PI) / 180)

			return { x1, y1, x2, y2, isMain }
		})
	}, [])

	return (
		<div className="w-full h-full flex items-center justify-center select-none overflow-hidden">
			<div className="w-21 h-21 shrink-0 rounded-full bg-content flex items-center justify-center p-1 shadow-xs border border-base-content/5">
				<div
					style={{ width: `${size}px`, height: `${size}px` }}
					className="relative flex items-center justify-center"
				>
					<svg width="100%" height="100%" viewBox="0 0 100 100">
						{hourMarkers.map(({ x1, y1, x2, y2, isMain }, i) => (
							<line
								key={i}
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
								stroke="currentColor"
								strokeWidth={isMain ? '2' : '1'}
								opacity={isMain ? '0.7' : '0.3'}
								className="stroke-base-content"
							/>
						))}

						{/* Center Pin */}
						<circle cx="50" cy="50" r="3" className="fill-primary" />

						{/* Hour hand */}
						<line
							x1="50"
							y1="50"
							x2={50 + 20 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
							y2={50 + 20 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
							strokeWidth="3.5"
							strokeLinecap="round"
							className="stroke-base-content transition-transform duration-300"
						/>

						{/* Minute hand */}
						<line
							x1="50"
							y1="50"
							x2={50 + 30 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
							y2={50 + 30 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
							strokeWidth="2"
							strokeLinecap="round"
							className="stroke-primary transition-transform duration-300"
						/>

						{/* Second hand */}
						<line
							x1="50"
							y1="50"
							x2={50 + 34 * Math.cos(((secondAngle - 90) * Math.PI) / 180)}
							y2={50 + 34 * Math.sin(((secondAngle - 90) * Math.PI) / 180)}
							strokeWidth="1"
							strokeLinecap="round"
							className="stroke-error transition-transform duration-100"
						/>
					</svg>
				</div>
			</div>
		</div>
	)
}
