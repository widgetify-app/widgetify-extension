interface SimpleProgressRingProps {
	value: number
	target: number
	color: string
	strokeWidth?: number
}

const SIZE = 32

export function SimpleProgressRing({
	value,
	target,
	color,
	strokeWidth = 3.5,
}: SimpleProgressRingProps) {
	const center = SIZE / 2
	const radius = (SIZE - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius
	const progress = Math.min(value / target, 1)
	const dashOffset = circumference * (1 - progress)

	return (
		<svg
			aria-hidden="true"
			width={SIZE}
			height={SIZE}
			viewBox={`0 0 ${SIZE} ${SIZE}`}
		>
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				className="stroke-fill-2"
				strokeWidth={strokeWidth}
			/>
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke={color}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeDasharray={circumference}
				strokeDashoffset={dashOffset}
				transform={`rotate(-90 ${center} ${center})`}
				style={{ transition: 'stroke-dashoffset 0.3s ease' }}
			/>
		</svg>
	)
}
