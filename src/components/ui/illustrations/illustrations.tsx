import { createContext, createElement, type ReactElement, useContext, useId } from 'react'
import { cn } from '@/common/utils/cn'

type Tone = 'brand' | 'soft' | 'paper' | 'deep' | 'danger' | 'onDanger'

const FILL: Record<Tone, string> = {
	brand: 'fill-brand',
	soft: 'fill-brand-muted',
	paper: 'fill-on-brand',
	deep: 'fill-brand-hover',
	danger: 'fill-danger',
	onDanger: 'fill-on-danger',
}

const STROKE: Record<Tone, string> = {
	brand: 'stroke-brand',
	soft: 'stroke-brand-muted',
	paper: 'stroke-on-brand',
	deep: 'stroke-brand-hover',
	danger: 'stroke-danger',
	onDanger: 'stroke-on-danger',
}

const GlossContext = createContext('art-gloss')

type BlobProps = {
	as: 'path' | 'rect' | 'circle' | 'ellipse'
	tone?: Tone
	round?: number
	ring?: boolean
} & Record<string, string | number | boolean | undefined>

function Blob({ as, tone = 'brand', round = 3, ring = false, ...geometry }: BlobProps) {
	const gloss = useContext(GlossContext)
	return (
		<>
			{createElement(as, {
				...geometry,
				strokeWidth: ring ? 3 : round,
				strokeLinejoin: 'round',
				className: cn(FILL[tone], ring ? 'stroke-surface' : STROKE[tone]),
			})}
			{createElement(as, {
				...geometry,
				fill: `url(#${gloss})`,
				stroke: ring ? 'none' : `url(#${gloss})`,
				strokeWidth: round,
				strokeLinejoin: 'round',
			})}
		</>
	)
}

function Spark({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
	return (
		<path
			className="fill-brand-muted"
			transform={`translate(${x} ${y}) scale(${scale})`}
			d="M0-5 1.8-1.8 5 0 1.8 1.8 0 5-1.8 1.8-5 0-1.8-1.8z"
		/>
	)
}

function Shine({ cx, cy, rx = 2, ry = 5, rotate = 0 }: Record<string, number>) {
	return (
		<ellipse
			fill="white"
			opacity="0.55"
			cx={cx}
			cy={cy}
			rx={rx}
			ry={ry}
			transform={`rotate(${rotate} ${cx} ${cy})`}
		/>
	)
}

function Badge({ cx, cy, children }: { cx: number; cy: number; children: ReactElement }) {
	return (
		<>
			<circle
				className="fill-brand-hover stroke-surface"
				strokeWidth="3"
				cx={cx}
				cy={cy}
				r="10"
			/>
			{children}
		</>
	)
}

const newspaper = (
	<>
		<Spark x={53} y={9} />
		<Blob as="rect" x="12" y="12" width="40" height="40" rx="7" />
		<rect className="fill-on-brand" x="17" y="17" width="30" height="30" rx="3.5" />
		<rect className="fill-brand" x="21" y="21" width="22" height="5" rx="2.5" />
		<rect
			className="fill-brand-muted"
			x="21"
			y="30"
			width="10"
			height="10"
			rx="2.5"
		/>
		<rect
			className="fill-brand-muted"
			x="34"
			y="30"
			width="9"
			height="2.6"
			rx="1.3"
		/>
		<rect
			className="fill-brand-muted"
			x="34"
			y="35"
			width="9"
			height="2.6"
			rx="1.3"
		/>
		<rect
			className="fill-brand-muted"
			x="34"
			y="40"
			width="6"
			height="2.6"
			rx="1.3"
		/>
	</>
)

const arts = {
	tasks: (
		<>
			<Spark x={54} y={14} />
			<Spark x={9} y={50} scale={0.7} />
			<Blob as="rect" x="14" y="10" width="36" height="44" rx="8" round={4} />
			<rect className="fill-on-brand" x="19" y="17" width="26" height="33" rx="4" />
			<Blob
				as="rect"
				tone="deep"
				x="24"
				y="4"
				width="16"
				height="8"
				rx="4"
				round={3}
			/>
			<circle className="fill-brand" cx="25" cy="25" r="3.4" />
			<path
				className="stroke-on-brand"
				d="m23.3 25 1.3 1.4 2.3-2.7"
				fill="none"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<rect
				className="fill-brand-muted"
				x="32"
				y="23"
				width="10"
				height="4"
				rx="2"
			/>
			<circle className="fill-brand" cx="25" cy="34" r="3.4" />
			<path
				className="stroke-on-brand"
				d="m23.3 34 1.3 1.4 2.3-2.7"
				fill="none"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<rect
				className="fill-brand-muted"
				x="32"
				y="32"
				width="10"
				height="4"
				rx="2"
			/>
			<circle
				className="stroke-brand-muted"
				cx="25"
				cy="43"
				r="3"
				fill="none"
				strokeWidth="1.6"
			/>
			<rect
				className="fill-brand-muted"
				x="32"
				y="41"
				width="7"
				height="4"
				rx="2"
			/>
		</>
	),
	habits: (
		<>
			<Spark x={53} y={20} />
			<path
				className="stroke-brand-hover"
				d="M32 40V26"
				fill="none"
				strokeWidth="3.4"
				strokeLinecap="round"
			/>
			<Blob as="path" tone="soft" d="M32 31C23 31 18 26 18 17c9 0 14 5 14 14Z" />
			<Blob as="path" tone="deep" d="M32 26c0-8 4-13 13-13 0 8-4 13-13 13Z" />
			<Blob
				as="path"
				d="M19 41h26l-2.6 11.2a4 4 0 0 1-3.9 3.1H25.5a4 4 0 0 1-3.9-3.1Z"
				round={3}
			/>
			<Blob as="rect" tone="deep" x="16" y="37" width="32" height="6" rx="3" />
			<Shine cx={24} cy={49} rx={1.6} ry={3.4} rotate={8} />
		</>
	),
	notes: (
		<>
			<Spark x={53} y={12} />
			<Blob
				as="path"
				d="M15 14a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v25L35 52H21a6 6 0 0 1-6-6Z"
				round={4}
			/>
			<path
				className="fill-on-brand"
				opacity="0.4"
				d="M47 39 35 52v-6a7 7 0 0 1 7-7Z"
			/>
			<rect
				className="fill-on-brand"
				opacity="0.75"
				x="21"
				y="17"
				width="20"
				height="4"
				rx="2"
			/>
			<rect
				className="fill-on-brand"
				opacity="0.75"
				x="21"
				y="27"
				width="20"
				height="4"
				rx="2"
			/>
			<rect
				className="fill-on-brand"
				opacity="0.75"
				x="21"
				y="37"
				width="11"
				height="4"
				rx="2"
			/>
			<g transform="rotate(30 50 40)">
				<rect
					className="fill-danger stroke-surface"
					strokeWidth="2.5"
					x="45"
					y="21"
					width="10"
					height="6"
					rx="3"
				/>
				<rect
					className="fill-brand-hover stroke-surface"
					strokeWidth="2.5"
					x="45"
					y="27"
					width="10"
					height="20"
				/>
				<path className="fill-brand-muted" d="M45 47h10l-5 9z" />
				<path className="fill-fg-muted" d="M48 52.5h4L50 56Z" />
			</g>
		</>
	),
	account: (
		<>
			<Spark x={53} y={9} />
			<Blob as="circle" cx="28" cy="20" r="10" />
			<Blob
				as="path"
				d="M11 52c0-10 7-17 17-17s17 7 17 17a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3Z"
				round={4}
			/>
			<Shine cx={23} cy={17} rx={1.8} ry={3.4} rotate={18} />
			<Badge cx={49} cy={46}>
				<path
					className="stroke-on-brand"
					d="M49 41v10M44 46h10"
					fill="none"
					strokeWidth="2.8"
					strokeLinecap="round"
				/>
			</Badge>
		</>
	),
	lock: (
		<>
			<Spark x={54} y={10} />
			<Spark x={9} y={22} scale={0.7} />
			<path
				className="stroke-brand-hover"
				d="M21 28V21a11 11 0 0 1 22 0v7"
				fill="none"
				strokeWidth="6.5"
				strokeLinecap="round"
			/>
			<Blob as="rect" x="14" y="29" width="36" height="24" rx="8" round={4} />
			<circle className="fill-on-brand" cx="32" cy="39" r="4.2" />
			<path
				className="stroke-on-brand"
				d="M32 41v6"
				fill="none"
				strokeWidth="3.6"
				strokeLinecap="round"
			/>
			<Shine cx={20} cy={37} rx={1.6} ry={4} />
		</>
	),
	allCaughtUp: (
		<>
			<circle className="fill-brand-hover" cx="30" cy="7" r="3.4" />
			<Blob
				as="path"
				d="M30 12c-8 0-13 6-13 14v9l-4 7h34l-4-7v-9c0-8-5-14-13-14Z"
				round={4}
			/>
			<Blob as="circle" tone="soft" cx="30" cy="48" r="4.6" round={2} />
			<Shine cx={23} cy={25} rx={2.4} ry={6} rotate={14} />
			<Badge cx={49} cy={15}>
				<path
					className="stroke-on-brand"
					d="m44.5 15 3.2 3.3 5.8-6.6"
					fill="none"
					strokeWidth="2.6"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</Badge>
		</>
	),
	photo: (
		<>
			<Spark x={54} y={9} />
			<Blob as="rect" x="8" y="14" width="44" height="38" rx="8" round={4} />
			<rect className="fill-on-brand" x="13" y="19" width="34" height="28" rx="4" />
			<circle className="fill-brand-muted" cx="38" cy="27" r="4.6" />
			<Blob
				as="path"
				d="M14 43 24 32l8 9 5-5 8 8v1a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2Z"
				round={2}
			/>
		</>
	),
	photoError: (
		<>
			<Blob
				as="rect"
				tone="danger"
				x="8"
				y="12"
				width="48"
				height="42"
				rx="8"
				round={4}
			/>
			<rect
				className="fill-on-danger"
				x="13"
				y="17"
				width="38"
				height="32"
				rx="4"
			/>
			<rect
				className="fill-danger"
				x="30.4"
				y="22"
				width="3.2"
				height="13"
				rx="1.6"
			/>
			<circle className="fill-danger" cx="32" cy="41" r="2.4" />
		</>
	),
	target: (
		<>
			<Spark x={10} y={12} />
			<path
				className="stroke-brand-muted"
				d="M23 49 17 58M41 49 47 58"
				fill="none"
				strokeWidth="3.6"
				strokeLinecap="round"
			/>
			<Blob as="circle" cx="32" cy="31" r="19" round={3} />
			<circle className="fill-on-brand" cx="32" cy="31" r="14" />
			<circle className="fill-brand" cx="32" cy="31" r="9.5" />
			<circle className="fill-on-brand" cx="32" cy="31" r="5" />
			<circle className="fill-brand-hover" cx="32" cy="31" r="2.2" />
			<path
				className="stroke-brand-hover"
				d="m51 12-18 18"
				fill="none"
				strokeWidth="3"
				strokeLinecap="round"
			/>
			<Blob as="path" tone="soft" d="M48 15 44 9l5-2 3 4Z" round={2} />
			<Blob as="path" tone="deep" d="M48 15 54 19l2-5-4-3Z" round={2} />
		</>
	),
	calendar: (
		<>
			<Spark x={9} y={16} />
			<Blob as="rect" x="13" y="12" width="38" height="42" rx="8" round={4} />
			<rect
				className="fill-brand-hover"
				x="21"
				y="5"
				width="5"
				height="11"
				rx="2.5"
			/>
			<rect
				className="fill-brand-hover"
				x="38"
				y="5"
				width="5"
				height="11"
				rx="2.5"
			/>
			<rect className="fill-on-brand" x="18" y="22" width="28" height="26" rx="4" />
			<circle className="fill-brand-muted" cx="24" cy="29" r="2" />
			<circle className="fill-brand-muted" cx="32" cy="29" r="2" />
			<circle className="fill-brand-muted" cx="40" cy="29" r="2" />
			<circle className="fill-brand-muted" cx="24" cy="37" r="2" />
			<circle className="fill-brand" cx="32" cy="37" r="4" />
			<circle className="fill-brand-muted" cx="40" cy="37" r="2" />
			<circle className="fill-brand-muted" cx="24" cy="44" r="2" />
			<circle className="fill-brand-muted" cx="32" cy="44" r="2" />
		</>
	),
	coin: (
		<>
			<Spark x={54} y={10} />
			<Spark x={55} y={42} scale={0.7} />
			<Blob as="circle" cx="35" cy="28" r="17" round={3} />
			<circle
				className="stroke-on-brand"
				cx="35"
				cy="28"
				r="12.5"
				fill="none"
				strokeWidth="1.6"
				opacity="0.45"
			/>
			<path
				className="stroke-on-brand"
				d="M35 19v18"
				fill="none"
				strokeWidth="2.2"
				strokeLinecap="round"
			/>
			<path
				className="stroke-on-brand"
				d="M39 22.5c-.8-1.5-2.4-2.2-4.2-2.2-2.7 0-4.3 1.4-4.3 3.3 0 2.7 3.3 3.2 5.2 4 2.4 1.1 3.8 2.4 3.8 4.7 0 2.4-1.9 4-4.3 4-2.4 0-4.3-1.1-5.2-2.9"
				fill="none"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
			<Blob
				as="path"
				tone="deep"
				d="M9 47v5c0 3 5.4 5 12 5s12-2 12-5v-5Z"
				round={2}
			/>
			<Blob as="ellipse" cx="21" cy="47" rx="12" ry="4.6" round={2} />
			<ellipse
				className="stroke-on-brand"
				cx="21"
				cy="47"
				rx="7"
				ry="2.4"
				fill="none"
				strokeWidth="1.4"
				opacity="0.5"
			/>
		</>
	),
	news: newspaper,
	outlineNewspaper: newspaper,
	users: (
		<>
			<Spark x={53} y={11} />
			<Spark x={10} y={16} scale={0.7} />
			<Blob as="circle" tone="soft" cx="17" cy="27" r="6.5" round={2} />
			<Blob
				as="path"
				tone="soft"
				d="M5 54c0-8 5-13 12-13 2.8 0 5 .8 7 2.6-1.8 2.8-3 6.4-3 10.4v1H7a2 2 0 0 1-2-2Z"
				round={2}
			/>
			<Blob as="circle" tone="soft" cx="47" cy="27" r="6.5" round={2} />
			<Blob
				as="path"
				tone="soft"
				d="M59 54c0-8-5-13-12-13-2.8 0-5 .8-7 2.6 1.8 2.8 3 6.4 3 10.4v1h16a2 2 0 0 0 2-2Z"
				round={2}
			/>
			<Blob as="circle" ring cx="32" cy="21" r="9" />
			<Blob
				as="path"
				ring
				d="M15 54c0-10 7-17 17-17s17 7 17 17a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3Z"
			/>
			<Shine cx={28} cy={18} rx={1.6} ry={3} rotate={18} />
		</>
	),
	consent: (
		<>
			<Spark x={54} y={9} />
			<Blob
				as="path"
				d="M30 7 48 13v14c0 11-7 20-18 25C19 47 12 38 12 27V13Z"
				round={4}
			/>
			<Shine cx={20} cy={22} rx={2} ry={6} rotate={8} />
			<Badge cx={47} cy={46}>
				<path
					className="stroke-on-brand"
					d="m42.2 46 3.4 3.5 6.2-7"
					fill="none"
					strokeWidth="2.6"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</Badge>
		</>
	),
	unavailable: (
		<>
			<Spark x={54} y={9} />
			<Blob as="rect" x="8" y="14" width="44" height="38" rx="8" round={4} />
			<rect className="fill-on-brand" x="13" y="19" width="34" height="28" rx="4" />
			<rect
				className="fill-brand-muted"
				x="18"
				y="26"
				width="24"
				height="4"
				rx="2"
			/>
			<rect
				className="fill-brand-muted"
				x="18"
				y="35"
				width="15"
				height="4"
				rx="2"
			/>
			<Badge cx={49} cy={46}>
				<path
					className="stroke-on-brand"
					d="M44.5 46h9"
					fill="none"
					strokeWidth="2.8"
					strokeLinecap="round"
				/>
			</Badge>
		</>
	),
	folder: (
		<>
			<Spark x={54} y={10} />
			<Blob
				as="path"
				tone="deep"
				d="M9 21a5 5 0 0 1 5-5h10l5 5h21a5 5 0 0 1 5 5v21H9Z"
				round={3}
			/>
			<rect className="fill-on-brand" x="15" y="24" width="34" height="18" rx="3" />
			<rect
				className="fill-brand-muted"
				x="20"
				y="29"
				width="16"
				height="3"
				rx="1.5"
			/>
			<rect
				className="fill-brand-muted"
				x="20"
				y="35"
				width="10"
				height="3"
				rx="1.5"
			/>
			<Blob
				as="path"
				d="M8 32a5 5 0 0 1 5-5h38a5 5 0 0 1 5 5v16a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5Z"
				round={3}
			/>
			<Shine cx={15} cy={39} rx={1.6} ry={4.5} />
		</>
	),
	search: (
		<>
			<Spark x={10} y={9} />
			<Blob as="rect" x="12" y="12" width="32" height="40" rx="7" round={4} />
			<rect className="fill-on-brand" x="17" y="17" width="22" height="30" rx="3" />
			<rect
				className="fill-brand-muted"
				x="21"
				y="23"
				width="14"
				height="3"
				rx="1.5"
			/>
			<rect
				className="fill-brand-muted"
				x="21"
				y="30"
				width="14"
				height="3"
				rx="1.5"
			/>
			<rect
				className="fill-brand-muted"
				x="21"
				y="37"
				width="8"
				height="3"
				rx="1.5"
			/>
			<path
				className="stroke-brand-hover"
				d="m50 47 7 7"
				fill="none"
				strokeWidth="6.5"
				strokeLinecap="round"
			/>
			<circle
				className="fill-on-brand stroke-brand-hover"
				cx="44"
				cy="41"
				r="9"
				strokeWidth="5"
			/>
			<Shine cx={40} cy={38} rx={1.4} ry={3} rotate={30} />
		</>
	),
} satisfies Record<string, ReactElement>

export type EmptyArtName = keyof typeof arts

export function isEmptyArtName(name: string): name is EmptyArtName {
	return name in arts
}

interface EmptyArtProps {
	name: EmptyArtName
	className?: string
}

export function EmptyArt({ name, className }: EmptyArtProps) {
	const glossId = `art-gloss-${useId().replace(/:/g, '')}`

	return (
		<svg
			viewBox="0 0 64 64"
			aria-hidden="true"
			className={cn('size-14 shrink-0', className)}
		>
			<defs>
				<linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="white" stopOpacity="0.5" />
					<stop offset="0.7" stopColor="white" stopOpacity="0" />
				</linearGradient>
			</defs>
			<ellipse
				className="fill-fg-muted"
				opacity="0.16"
				cx="32"
				cy="60"
				rx="17"
				ry="2.6"
			/>
			<GlossContext.Provider value={glossId}>{arts[name]}</GlossContext.Provider>
		</svg>
	)
}
