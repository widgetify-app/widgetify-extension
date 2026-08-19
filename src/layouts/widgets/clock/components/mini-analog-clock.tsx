interface MiniAnalogClockProps {
	time: Date
	showSeconds: boolean
	size?: number
}

export function MiniAnalogClock({
	time,
	showSeconds,
	size = 56,
}: MiniAnalogClockProps) {
	const hours = time.getHours() % 12
	const minutes = time.getMinutes()
	const seconds = time.getSeconds()

	const hourAngle = hours * 30 + minutes * 0.5
	const minuteAngle = minutes * 6
	const secondAngle = seconds * 6

	return (
		<div
			style={{ width: size, height: size }}
			className="relative shrink-0 flex items-center justify-center rounded-full bg-base-300/30 border border-base-content/10"
		>
			<svg
				width={size}
				height={size}
				viewBox="0 0 100 100"
				className="w-full h-full"
			>
				{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
					(angle, i) => {
						const isMain = angle % 90 === 0
						const r1 = isMain ? 38 : 42
						const r2 = 46
						const rad = ((angle - 90) * Math.PI) / 180
						return (
							<line
								key={i}
								x1={50 + r1 * Math.cos(rad)}
								y1={50 + r1 * Math.sin(rad)}
								x2={50 + r2 * Math.cos(rad)}
								y2={50 + r2 * Math.sin(rad)}
								stroke="currentColor"
								strokeWidth={isMain ? 3 : 1.5}
								className="text-base-content/40"
							/>
						)
					}
				)}

				<line
					x1="50"
					y1="50"
					x2={50 + 26 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
					y2={50 + 26 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
					className="text-content"
				/>

				<line
					x1="50"
					y1="50"
					x2={50 + 36 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
					y2={50 + 36 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					className="text-content/80"
				/>

				{showSeconds && (
					<line
						x1="50"
						y1="50"
						x2={50 + 38 * Math.cos(((secondAngle - 90) * Math.PI) / 180)}
						y2={50 + 38 * Math.sin(((secondAngle - 90) * Math.PI) / 180)}
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						className="text-primary"
					/>
				)}

				<circle
					cx="50"
					cy="50"
					r="3"
					fill="currentColor"
					className="text-content"
				/>
			</svg>
		</div>
	)
}
