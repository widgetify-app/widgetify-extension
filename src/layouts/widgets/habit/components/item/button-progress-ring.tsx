interface SegmentedProgressRingProps {
	value: number
	target: number
	color: string
	size?: number
	strokeWidth?: number
	gap?: number
}

export function SegmentedProgressRing({
	value,
	target,
	color,
	size = 32,
	strokeWidth = 3.5,
	gap = 2,
}: SegmentedProgressRingProps) {
	const center = size / 2
	const radius = (size - strokeWidth) / 2

	const segmentAngle = (2 * Math.PI) / target
	const gapAngle = gap / radius
	const actualSegmentAngle = segmentAngle - gapAngle

	const getPoint = (angle: number) => ({
		x: center + radius * Math.cos(angle),
		y: center + radius * Math.sin(angle),
	})

	const segments = []
	for (let i = 0; i < target; i++) {
		const startAngle = -Math.PI / 2 + i * segmentAngle
		const endAngle = startAngle + actualSegmentAngle

		const start = getPoint(startAngle)
		const end = getPoint(endAngle)
		const largeArc = actualSegmentAngle > Math.PI ? 1 : 0

		const pathData = `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}
    `

		const isFilled = i < value

		segments.push(
			<path
				key={i}
				d={pathData}
				fill="none"
				strokeLinecap={'round'}
				className={isFilled ? `` : `stroke-base-200`}
				stroke={isFilled ? color : undefined}
				strokeWidth={strokeWidth}
				opacity={isFilled ? 1 : 0.8}
				style={{ transition: 'stroke 0.3s ease' }}
			/>
		)
	}

	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
			{segments}
		</svg>
	)
}
