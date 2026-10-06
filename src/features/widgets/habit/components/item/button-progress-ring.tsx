interface SegmentedProgressRingProps {
	value: number
	target: number
	color: string
	strokeWidth?: number
	gap?: number
}

const SIZE = 32

export function SegmentedProgressRing({
	value,
	target,
	color,
	strokeWidth = 3.5,
	gap = 2,
}: SegmentedProgressRingProps) {
	const center = SIZE / 2
	const radius = (SIZE - strokeWidth) / 2

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
				className={isFilled ? undefined : 'stroke-fill-2'}
				stroke={isFilled ? color : undefined}
				strokeWidth={strokeWidth}
				style={{ transition: 'stroke 0.3s ease' }}
			/>
		)
	}

	return (
		<svg
			aria-hidden="true"
			width={SIZE}
			height={SIZE}
			viewBox={`0 0 ${SIZE} ${SIZE}`}
		>
			{segments}
		</svg>
	)
}
