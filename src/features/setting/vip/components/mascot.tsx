import { type CSSProperties, useId } from 'react'
import { cn } from '@/common/utils/cn'

interface MascotProps {
	pose: 'wave' | 'cheer' | 'peek'
	className?: string
}

const HEAD =
	'M160 58C156 36 146 17 106 16C58 15 28 41 28 92L28 166C28 214 56 237 104 238L196 238C244 237 272 214 272 166L272 98C272 54 252 29 215 28C184 28 169 40 164 58Q162 64 160 58Z'

const LEFT_ARM: CSSProperties = {
	transformBox: 'view-box',
	transformOrigin: '110px 244px',
	transform: 'rotate(9deg)',
}

const RIGHT_ARM: CSSProperties = {
	transformBox: 'view-box',
	transformOrigin: '190px 244px',
	transform: 'rotate(-9deg)',
}

const SPARKLES = [
	{
		d: 'M34 64l4 10 10 4-10 4-4 10-4-10-10-4 10-4z',
		tone: 'fill-warning',
		delay: '0s',
	},
	{ d: 'M270 34l3 8 8 3-8 3-3 8-3-8-8-3 8-3z', tone: 'fill-vip', delay: '0.5s' },
	{ d: 'M284 180l3 7 7 3-7 3-3 7-3-7-7-3 7-3z', tone: 'fill-warning', delay: '0.9s' },
	{ d: 'M14 198l3 7 7 3-7 3-3 7-3-7-7-3 7-3z', tone: 'fill-vip', delay: '1.3s' },
]

export function Mascot({ pose, className }: MascotProps) {
	const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
	const isPeek = pose === 'peek'
	const isCheer = pose === 'cheer'
	const fill = (name: string) => `url(#${uid}${name})`

	return (
		<svg
			viewBox={isPeek ? '0 0 300 262' : '0 0 300 400'}
			aria-hidden="true"
			className={cn('block overflow-visible', className)}
		>
			<defs>
				<radialGradient id={`${uid}head`} cx="0.36" cy="0.24" r="0.9">
					<stop offset="0" stopColor="#ffffff" />
					<stop offset="0.5" stopColor="#fcfcfe" />
					<stop offset="0.82" stopColor="#eff1f6" />
					<stop offset="1" stopColor="#e0e3ec" />
				</radialGradient>
				<linearGradient id={`${uid}shade`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
					<stop offset="1" stopColor="#8e93ae" stopOpacity="0.18" />
				</linearGradient>
				<radialGradient id={`${uid}glint`} cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor="#ffffff" stopOpacity="1" />
					<stop offset="1" stopColor="#ffffff" stopOpacity="0" />
				</radialGradient>
				<linearGradient id={`${uid}body`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#e2e5ee" />
					<stop offset="0.38" stopColor="#ffffff" />
					<stop offset="0.7" stopColor="#fafbfd" />
					<stop offset="1" stopColor="#dcdfea" />
				</linearGradient>
				<linearGradient id={`${uid}tee`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
					<stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
					<stop offset="1" stopColor="#000000" stopOpacity="0.22" />
				</linearGradient>
			</defs>

			{!isPeek && (
				<ellipse
					cx="150"
					cy="387"
					rx="66"
					ry="8"
					fill="#1b1d3a"
					fillOpacity="0.13"
					className={cn(
						'[transform-box:fill-box] origin-center',
						isCheer ? 'animate-mascot-shadow-hop' : 'animate-mascot-shadow'
					)}
				/>
			)}

			<g
				className={cn(
					!isPeek && (isCheer ? 'animate-mascot-hop' : 'animate-mascot-float')
				)}
			>
				{!isPeek && (
					<g>
						<rect
							x="115"
							y="318"
							width="30"
							height="52"
							rx="14"
							fill={fill('body')}
						/>
						<rect
							x="155"
							y="318"
							width="30"
							height="52"
							rx="14"
							fill={fill('body')}
						/>
						<ellipse cx="128" cy="369" rx="20" ry="11" fill={fill('body')} />
						<ellipse cx="172" cy="369" rx="20" ry="11" fill={fill('body')} />
						<path
							d="M118 372v4M126 374v4M134 373v4M166 373v4M174 374v4M182 372v4"
							stroke="#cbd0db"
							strokeWidth="1.6"
							strokeLinecap="round"
							fill="none"
						/>
					</g>
				)}

				{pose === 'wave' && <Arm side="left" fill={fill} style={LEFT_ARM} />}

				{!isPeek && (
					<g>
						<path
							d="M113 226C101 262 98 300 105 330C111 347 189 347 195 330C202 300 199 262 187 226Z"
							fill={fill('body')}
						/>
						<circle cx="150" cy="322" r="1.9" fill="#c6cad6" />
						<path
							d="M106 242Q118 233 132 234Q150 251 168 234Q182 233 194 242C200 264 201 286 198 306Q150 318 102 306C99 286 100 264 106 242Z"
							className="fill-vip"
						/>
						<path
							d="M106 242Q118 233 132 234Q150 251 168 234Q182 233 194 242C200 264 201 286 198 306Q150 318 102 306C99 286 100 264 106 242Z"
							fill={fill('tee')}
						/>
						<path
							d="M132 234Q150 251 168 234"
							stroke="#000000"
							strokeOpacity="0.22"
							strokeWidth="3.5"
							strokeLinecap="round"
							fill="none"
						/>
						<path
							d="M104 301Q150 313 196 301"
							stroke="#000000"
							strokeOpacity="0.1"
							strokeWidth="2"
							fill="none"
						/>
						<path d="M139 271L144 265H156L161 271L150 285Z" fill="#ffffff" />
						<path
							d="M139 271H161M144 265L147.5 271L150 285M156 265L152.5 271L150 285"
							strokeWidth="1.2"
							strokeLinejoin="round"
							fill="none"
							className="stroke-vip"
						/>
						<ellipse
							cx="150"
							cy="239"
							rx="52"
							ry="9"
							fill="#1b1d3a"
							fillOpacity="0.12"
						/>
					</g>
				)}

				<g>
					<path
						d={HEAD}
						fill={fill('head')}
						stroke="#1b1d3a"
						strokeOpacity="0.07"
						strokeWidth="1.5"
					/>
					<path d={HEAD} fill={fill('shade')} />
					<ellipse
						cx="96"
						cy="58"
						rx="40"
						ry="22"
						fill={fill('glint')}
						opacity="0.9"
						transform="rotate(-18 96 58)"
					/>
					{isCheer ? <CheerFace /> : <SmileFace />}
				</g>

				{isCheer && (
					<Arm
						side="left"
						fill={fill}
						style={LEFT_ARM}
						className="animate-mascot-cheer-left"
					/>
				)}
				{!isPeek && (
					<Arm
						side="right"
						fill={fill}
						style={RIGHT_ARM}
						className={
							isCheer ? 'animate-mascot-cheer-right' : 'animate-mascot-wave'
						}
					/>
				)}

				{isPeek && (
					<g>
						<ellipse
							cx="94"
							cy="246"
							rx="19"
							ry="12"
							fill={fill('body')}
							stroke="#1b1d3a"
							strokeOpacity="0.08"
						/>
						<ellipse
							cx="206"
							cy="246"
							rx="19"
							ry="12"
							fill={fill('body')}
							stroke="#1b1d3a"
							strokeOpacity="0.08"
						/>
						<path
							d="M87 244v6M95 243v7M199 244v6M207 243v7"
							stroke="#cbd0db"
							strokeWidth="1.6"
							strokeLinecap="round"
							fill="none"
						/>
					</g>
				)}

				{isCheer &&
					SPARKLES.map((sparkle) => (
						<path
							key={sparkle.d}
							d={sparkle.d}
							style={{ animationDelay: sparkle.delay }}
							className={cn(
								'[transform-box:fill-box] origin-center animate-mascot-twinkle',
								sparkle.tone
							)}
						/>
					))}
			</g>
		</svg>
	)
}

interface ArmProps {
	side: 'left' | 'right'
	fill: (name: string) => string
	style: CSSProperties
	className?: string
}

function Arm({ side, fill, style, className }: ArmProps) {
	const x = side === 'left' ? 97 : 178
	return (
		<g style={style} className={className}>
			<rect
				x={x}
				y="238"
				width="25"
				height="74"
				rx="12.5"
				fill={fill('body')}
				stroke="#1b1d3a"
				strokeOpacity="0.06"
			/>
			<rect x={x - 4} y="234" width="33" height="30" rx="12" className="fill-vip" />
			<rect x={x - 4} y="234" width="33" height="30" rx="12" fill={fill('tee')} />
		</g>
	)
}

function SmileFace() {
	return (
		<>
			<g className="[transform-box:fill-box] origin-center animate-mascot-blink">
				<rect x="98" y="126" width="15" height="46" rx="7.5" fill="#1f2029" />
				<rect x="187" y="126" width="15" height="46" rx="7.5" fill="#1f2029" />
			</g>
			<path
				d="M134 182Q150 196 166 182"
				stroke="#1f2029"
				strokeWidth="4.5"
				strokeLinecap="round"
				fill="none"
			/>
		</>
	)
}

function CheerFace() {
	return (
		<>
			<path
				d="M94 156Q105.5 136 117 156"
				stroke="#1f2029"
				strokeWidth="7"
				strokeLinecap="round"
				fill="none"
			/>
			<path
				d="M183 156Q194.5 136 206 156"
				stroke="#1f2029"
				strokeWidth="7"
				strokeLinecap="round"
				fill="none"
			/>
			<path
				d="M131 177Q150 216 169 177Z"
				fill="#2a1a24"
				stroke="#2a1a24"
				strokeWidth="4"
				strokeLinejoin="round"
			/>
			<path
				d="M141 190Q150 185 159 190Q156 196.5 150 196.5Q144 196.5 141 190Z"
				fill="#f27c91"
			/>
			<ellipse cx="86" cy="182" rx="13" ry="7" fill="#ff9fb2" fillOpacity="0.45" />
			<ellipse cx="214" cy="182" rx="13" ry="7" fill="#ff9fb2" fillOpacity="0.45" />
		</>
	)
}
