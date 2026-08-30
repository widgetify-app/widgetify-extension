import { useEffect, useId, useMemo, useState } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getCurrentDate } from '@/layouts/widgets/calendar/utils'

interface ClockAnalogProps {
	size?: number
	time?: Date
}

/* Apple Watch style palette (matches the reference design) */
const FACE_COLOR = '#FDFDFB'
const BEZEL_COLOR = '#1A1A1A'
const HAND_COLOR = '#1A1A1A'
const NUMERAL_COLOR = '#1A1A1A'
const SECOND_HAND_COLOR = '#F7A600'

export function ClockAnalog({ size = 76, time: propTime }: ClockAnalogProps) {
	const { selected_timezone: timezone } = useGeneralSetting()
	const [internalTime, setInternalTime] = useState<Date>(() =>
		getCurrentDate(timezone.value).toDate()
	)

	useEffect(() => {
		if (propTime) return
		const timer = setInterval(() => {
			setInternalTime(new Date())
		}, 1000)
		return () => clearInterval(timer)
	}, [propTime])

	const time = propTime || internalTime

	/* Unique id per instance so multiple clocks don't share one SVG filter */
	const filterId = useId().replace(/[^a-zA-Z0-9-]/g, '')

	const hours = time.getHours() % 12
	const minutes = time.getMinutes()
	const seconds = time.getSeconds()

	const hourAngle = hours * 30 + minutes * 0.5
	const minuteAngle = minutes * 6
	const secondAngle = seconds * 6

	const numerals = useMemo(() => {
		return Array.from({ length: 12 }, (_, i) => {
			const numeral = i === 0 ? 12 : i
			const angle = i * 30
			const radius = 37

			return {
				numeral,
				x: 50 + radius * Math.cos(((angle - 90) * Math.PI) / 180),
				y: 50 + radius * Math.sin(((angle - 90) * Math.PI) / 180),
			}
		})
	}, [])

	return (
		<div className="w-full h-full flex items-center justify-center select-none overflow-hidden">
			<div
				style={{ width: `${size}px`, height: `${size}px` }}
				className="relative shrink-0 rounded-full"
			>
				<svg width="100%" height="100%" viewBox="0 0 100 100">
					<defs>
						<filter
							id={filterId}
							filterUnits="userSpaceOnUse"
							x="0"
							y="0"
							width="100"
							height="100"
						>
							<feDropShadow
								dx="0"
								dy="0.6"
								stdDeviation="0.6"
								floodColor="#000000"
								floodOpacity="0.3"
							/>
						</filter>
					</defs>

					{/* Bezel + face */}
					<circle cx="50" cy="50" r="49.7" fill={BEZEL_COLOR} />
					<circle cx="50" cy="50" r="45.7" fill={FACE_COLOR} />

					{/* Hour numerals */}
					<g
						textAnchor="middle"
						dominantBaseline="central"
						fontSize="13.5"
						fontWeight="700"
						fill={NUMERAL_COLOR}
						className="font-latin"
					>
						{numerals.map(({ numeral, x, y }) => (
							<text key={numeral} x={x} y={y}>
								{numeral}
							</text>
						))}
					</g>

					{/* Hour + minute hands */}
					<g filter={`url(#${filterId})`}>
						{/* Hour hand */}
						<line
							x1="50"
							y1="50"
							x2={50 + 25 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
							y2={50 + 25 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
							stroke={HAND_COLOR}
							strokeWidth="4.2"
							strokeLinecap="round"
						/>

						{/* Minute hand */}
						<line
							x1="50"
							y1="50"
							x2={50 + 34 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
							y2={50 + 34 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
							stroke={HAND_COLOR}
							strokeWidth="3.6"
							strokeLinecap="round"
						/>
					</g>

					{/* Second hand */}
					<g filter={`url(#${filterId})`}>
						<line
							x1={50 - 8 * Math.cos(((secondAngle - 90) * Math.PI) / 180)}
							y1={50 - 8 * Math.sin(((secondAngle - 90) * Math.PI) / 180)}
							x2={50 + 40 * Math.cos(((secondAngle - 90) * Math.PI) / 180)}
							y2={50 + 40 * Math.sin(((secondAngle - 90) * Math.PI) / 180)}
							stroke={SECOND_HAND_COLOR}
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</g>

					{/* Center pin */}
					<circle cx="50" cy="50" r="2.2" fill={SECOND_HAND_COLOR} />
				</svg>
			</div>
		</div>
	)
}
