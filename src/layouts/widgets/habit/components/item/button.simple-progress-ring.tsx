interface SimpleProgressRingProps {
	value: number
	target: number
	color: string
	size?: number
	strokeWidth?: number
}

export function SimpleProgressRing({
	value,
	target,
	color,
	size = 32,
	strokeWidth = 3.5,
}: SimpleProgressRingProps) {
	const center = size / 2
	const radius = (size - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius
	const progress = Math.min(value / target, 1)
	const dashOffset = circumference * (1 - progress)

	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke="#d1d5db"
				strokeWidth={strokeWidth}
				opacity={0.3}
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
