import { useMemo } from 'react'
import { buildQrMatrix } from '../utils/qr'

const QUIET_ZONE = 4

interface QrCodeProps {
	text: string
	label: string
	className?: string
}

export function QrCode({ text, label, className }: QrCodeProps) {
	const { size, path } = useMemo(() => {
		const matrix = buildQrMatrix(text)
		const modules = matrix.flatMap((row, y) =>
			row.flatMap((dark, x) => (dark ? [`M${x} ${y}h1v1h-1z`] : []))
		)

		return { size: matrix.length, path: modules.join('') }
	}, [text])

	const edge = size + QUIET_ZONE * 2

	return (
		<svg
			role="img"
			aria-label={label}
			viewBox={`${-QUIET_ZONE} ${-QUIET_ZONE} ${edge} ${edge}`}
			shapeRendering="crispEdges"
			className={className}
		>
			<rect
				x={-QUIET_ZONE}
				y={-QUIET_ZONE}
				width={edge}
				height={edge}
				fill="white"
			/>
			<path d={path} fill="black" />
		</svg>
	)
}
