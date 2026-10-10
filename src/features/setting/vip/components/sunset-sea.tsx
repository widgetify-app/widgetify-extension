import { Fragment, useId } from 'react'
import { cn } from '@/common/utils/cn'

const SEA_LINE = 250

function wavePath(y: number, amplitude: number, length: number): string {
	let path = `M0 ${y}`
	for (let x = 0; x < 1740; x += length) {
		path += ` Q${x + length / 4} ${y - amplitude} ${x + length / 2} ${y}`
		path += ` T${x + length} ${y}`
	}
	return `${path} L1740 352 L0 352 Z`
}

const WAVES = [
	{ d: wavePath(264, 5, 290), fill: '#3b3a8c', motion: 'animate-pro-drift-slow' },
	{ d: wavePath(290, 7, 174), fill: '#2d2b76', motion: 'animate-pro-drift' },
	{ d: wavePath(318, 9, 145), fill: '#201e5b', motion: 'animate-pro-drift-fast' },
]

const DETAILED_STARS = [
	[60, 38, 1.4, 0],
	[140, 84, 1.1, 0.6],
	[230, 30, 1.6, 1.2],
	[410, 60, 1.2, 0.3],
	[520, 24, 1.5, 1.8],
	[600, 98, 1.1, 0.9],
	[700, 46, 1.3, 1.5],
	[820, 110, 1.2, 2.1],
	[330, 112, 1, 1],
]

const COMPACT_STARS = [
	[120, 50, 3, 0],
	[380, 40, 2.5, 0.8],
	[640, 70, 3, 1.6],
	[780, 30, 2.5, 0.4],
]

const CLOUDS = [
	[120, 156, 70, 8, 0.35],
	[520, 186, 90, 7, 0.3],
	[760, 134, 60, 6, 0.3],
	[990, 156, 70, 8, 0.35],
	[1390, 186, 90, 7, 0.3],
	[1630, 134, 60, 6, 0.3],
]

const SHIMMER = [
	[266, 260, 68, 0],
	[276, 268, 48, 0.4],
	[284, 277, 32, 0.8],
]

interface SunsetSeaProps {
	detailed?: boolean
	className?: string
}

export function SunsetSea({ detailed = false, className }: SunsetSeaProps) {
	const skyId = `${useId().replace(/[^a-zA-Z0-9]/g, '')}sky`
	const sunX = detailed ? 300 : 435
	const sunRadius = detailed ? 46 : 56

	return (
		<svg
			viewBox="0 0 870 352"
			preserveAspectRatio="xMidYMid slice"
			aria-hidden="true"
			className={cn('absolute inset-0 size-full', className)}
		>
			<defs>
				<linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#1e1b4f" />
					<stop offset="0.45" stopColor="#4b3591" />
					<stop offset="0.8" stopColor="#c8618a" />
					<stop offset="1" stopColor="#ffa978" />
				</linearGradient>
			</defs>
			<rect width="870" height={SEA_LINE} fill={`url(#${skyId})`} />
			<g fill="#ffffff">
				{(detailed ? DETAILED_STARS : COMPACT_STARS).map(([cx, cy, r, delay]) => (
					<circle
						key={`${cx}-${cy}`}
						cx={cx}
						cy={cy}
						r={r}
						style={{ animationDelay: `${delay}s` }}
						className="animate-pro-star"
					/>
				))}
			</g>
			<circle
				cx={sunX}
				cy={SEA_LINE}
				r={sunRadius * 2}
				fill="#ffc48a"
				className="[transform-box:fill-box] origin-center animate-pro-glow"
			/>
			<circle cx={sunX} cy={SEA_LINE} r={sunRadius} fill="#ffe0a8" />
			{detailed && (
				<g fill="#f7a8b0" className="animate-pro-clouds">
					{CLOUDS.map(([cx, cy, rx, ry, opacity]) => (
						<ellipse
							key={cx}
							cx={cx}
							cy={cy}
							rx={rx}
							ry={ry}
							fillOpacity={opacity}
						/>
					))}
				</g>
			)}
			<rect y={SEA_LINE} width="870" height="102" fill="#4c4a9e" />
			{WAVES.map((wave, index) => (
				<Fragment key={wave.fill}>
					<g className={wave.motion}>
						<path d={wave.d} fill={wave.fill} />
					</g>
					{detailed && index === 0 && (
						<g fill="#ffd9a0">
							{SHIMMER.map(([x, y, width, delay]) => (
								<rect
									key={y}
									x={x}
									y={y}
									width={width}
									height="2.5"
									rx="1.2"
									style={{ animationDelay: `${delay}s` }}
									className="[transform-box:fill-box] origin-center animate-pro-shimmer"
								/>
							))}
						</g>
					)}
				</Fragment>
			))}
		</svg>
	)
}
