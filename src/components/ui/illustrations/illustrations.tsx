import type { ReactElement } from 'react'
import { cn } from '@/common/utils/cn'

const arts = {
	tasks: (
		<>
			<path
				className="fill-brand-muted"
				d="M13 7.5 15 12l4.5 2L15 16l-2 4.5L11 16l-4.5-2L11 12z"
			/>
			<rect className="fill-brand" x="14" y="6" width="38" height="50" rx="7" />
			<rect className="fill-on-brand" x="18" y="10" width="30" height="42" rx="4" />
			<circle className="fill-brand" cx="25" cy="20" r="3.6" />
			<path
				className="stroke-on-brand"
				d="m23.2 20 1.3 1.4 2.4-2.8"
				fill="none"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<rect
				className="fill-brand-muted"
				x="32"
				y="18.5"
				width="11"
				height="3"
				rx="1.5"
			/>
			<circle
				className="stroke-brand-muted"
				cx="25"
				cy="31"
				r="3.2"
				fill="none"
				strokeWidth="1.6"
			/>
			<rect
				className="fill-brand-muted"
				x="32"
				y="29.5"
				width="11"
				height="3"
				rx="1.5"
			/>
			<circle
				className="stroke-brand-muted"
				cx="25"
				cy="42"
				r="3.2"
				fill="none"
				strokeWidth="1.6"
			/>
			<rect
				className="fill-brand-muted"
				x="32"
				y="40.5"
				width="8"
				height="3"
				rx="1.5"
			/>
			<rect
				className="fill-brand-muted"
				x="48"
				y="14"
				width="9"
				height="5"
				rx="2.5"
			/>
			<rect
				className="fill-brand-muted"
				x="48"
				y="27"
				width="9"
				height="5"
				rx="2.5"
			/>
			<rect
				className="fill-brand-muted"
				x="48"
				y="40"
				width="9"
				height="5"
				rx="2.5"
			/>
		</>
	),
	habits: (
		<>
			<path
				className="fill-brand-muted"
				d="M32 30C21 30 15 23 15 13c11 0 17 6 17 17Z"
			/>
			<path
				className="fill-brand-hover"
				d="M32 24c0-9 5-15 16-15 0 9-5 15-16 15Z"
			/>
			<path
				className="stroke-brand"
				d="M32 40V22"
				fill="none"
				strokeWidth="3.2"
				strokeLinecap="round"
			/>
			<path
				className="fill-brand"
				d="M17 39h30l-3.4 16.2A4 4 0 0 1 39.7 58H24.3a4 4 0 0 1-3.9-2.8z"
			/>
			<rect className="fill-brand" x="14" y="35" width="36" height="7" rx="3.5" />
			<path
				className="fill-brand-muted"
				d="M54 14c0 0-5 5.8-5 9.2a5 5 0 0 0 10 0C59 19.8 54 14 54 14Z"
			/>
		</>
	),
	notes: (
		<>
			<path
				className="fill-brand"
				d="M12 13a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v28L36 53H18a6 6 0 0 1-6-6Z"
			/>
			<path
				className="fill-on-brand"
				opacity="0.3"
				d="M48 41 36 53v-6a6 6 0 0 1 6-6Z"
			/>
			<rect
				className="fill-on-brand"
				opacity="0.55"
				x="19"
				y="16"
				width="22"
				height="3.4"
				rx="1.7"
			/>
			<rect
				className="fill-on-brand"
				opacity="0.55"
				x="19"
				y="26"
				width="22"
				height="3.4"
				rx="1.7"
			/>
			<rect
				className="fill-on-brand"
				opacity="0.55"
				x="19"
				y="36"
				width="12"
				height="3.4"
				rx="1.7"
			/>
			<g transform="rotate(32 49 40)">
				<rect
					className="fill-brand-hover"
					x="44.5"
					y="20"
					width="9"
					height="6"
					rx="2.5"
				/>
				<rect
					className="fill-brand-muted"
					x="44.5"
					y="26"
					width="9"
					height="26"
				/>
				<path className="fill-fg-muted" d="M44.5 52h9L49 61Z" />
			</g>
		</>
	),
	account: (
		<>
			<path
				className="fill-brand-muted"
				d="M52 4.5 53.8 8.5 57.8 10.3 53.8 12.1 52 16.1 50.2 12.1 46.2 10.3 50.2 8.5z"
			/>
			<circle className="fill-brand" cx="28" cy="20" r="11" />
			<path
				className="fill-brand"
				d="M8 54c0-12 9-20 20-20s20 8 20 20a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3Z"
			/>
			<circle
				className="fill-brand-hover stroke-surface"
				strokeWidth="3"
				cx="50"
				cy="46"
				r="10"
			/>
			<path
				className="stroke-on-brand"
				d="M50 41v10M45 46h10"
				fill="none"
				strokeWidth="2.6"
				strokeLinecap="round"
			/>
		</>
	),
	allCaughtUp: (
		<>
			<path
				className="fill-brand"
				d="M32 6a3.5 3.5 0 0 1 3.5 3.5v1.3c8.3 1.5 13.5 8.3 13.5 16.7v8.5l4.8 7.9a2.2 2.2 0 0 1-1.9 3.3H12.1a2.2 2.2 0 0 1-1.9-3.3L15 36v-8.5c0-8.4 5.2-15.2 13.5-16.7V9.5A3.5 3.5 0 0 1 32 6Z"
			/>
			<path className="fill-brand-muted" d="M25.5 51.5a6.5 6.5 0 0 0 13 0Z" />
			<circle
				className="fill-brand-hover stroke-surface"
				strokeWidth="3"
				cx="49"
				cy="17"
				r="10"
			/>
			<path
				className="stroke-on-brand"
				d="m44.5 17 3.2 3.3 6-6.8"
				fill="none"
				strokeWidth="2.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</>
	),
	photo: (
		<>
			<path
				className="fill-brand-muted"
				d="M54 5.5 55.8 9.5 59.8 11.3 55.8 13.1 54 17.1 52.2 13.1 48.2 11.3 52.2 9.5z"
			/>
			<rect className="fill-brand" x="6" y="14" width="46" height="40" rx="7" />
			<rect className="fill-on-brand" x="10" y="18" width="38" height="32" rx="4" />
			<circle className="fill-brand-muted" cx="38" cy="27" r="5" />
			<path
				className="fill-brand"
				d="M10 42 22 29l9 10 6-6 11 10v4a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4Z"
			/>
		</>
	),
	photoError: (
		<>
			<rect className="fill-danger" x="8" y="10" width="48" height="44" rx="7" />
			<rect
				className="fill-on-danger"
				x="12"
				y="14"
				width="40"
				height="36"
				rx="4"
			/>
			<rect
				className="fill-danger"
				x="30.5"
				y="21"
				width="3"
				height="14"
				rx="1.5"
			/>
			<circle className="fill-danger" cx="32" cy="41" r="2.2" />
		</>
	),
	target: (
		<>
			<path
				className="fill-brand-muted"
				d="M12 7.5 13.8 11.5 17.8 13.3 13.8 15.1 12 19.1 10.2 15.1 6.2 13.3 10.2 11.5z"
			/>
			<path
				className="stroke-brand-muted"
				d="M23 49 17 58M41 49 47 58"
				fill="none"
				strokeWidth="3"
				strokeLinecap="round"
			/>
			<circle className="fill-brand" cx="32" cy="31" r="20" />
			<circle className="fill-on-brand" cx="32" cy="31" r="15" />
			<circle className="fill-brand" cx="32" cy="31" r="10" />
			<circle className="fill-on-brand" cx="32" cy="31" r="5" />
			<circle className="fill-brand-hover" cx="32" cy="31" r="2.2" />
			<path
				className="stroke-brand-hover"
				d="m51 12-18 18"
				fill="none"
				strokeWidth="2.8"
				strokeLinecap="round"
			/>
			<path className="fill-brand" d="M48 15 44 9l5-2 3 4Z" />
			<path className="fill-brand-muted" d="M48 15 54 19l2-5-4-3Z" />
		</>
	),
	calendar: (
		<>
			<path
				className="fill-brand-muted"
				d="M9 13.5 10.8 17.5 14.8 19.3 10.8 21.1 9 25.1 7.2 21.1 3.2 19.3 7.2 17.5z"
			/>
			<rect className="fill-brand-muted" x="21" y="6" width="4" height="8" rx="2" />
			<rect className="fill-brand-muted" x="39" y="6" width="4" height="8" rx="2" />
			<rect className="fill-brand" x="13" y="10" width="40" height="46" rx="7" />
			<circle className="fill-on-brand" cx="23" cy="16.5" r="2" />
			<circle className="fill-on-brand" cx="41" cy="16.5" r="2" />
			<rect className="fill-on-brand" x="17" y="23" width="32" height="29" rx="4" />
			<rect
				className="fill-brand-muted"
				x="21"
				y="28"
				width="24"
				height="2.5"
				rx="1.2"
			/>
			<circle className="fill-brand-muted" cx="22" cy="35" r="1.8" />
			<circle className="fill-brand-muted" cx="28" cy="35" r="1.8" />
			<circle className="fill-brand-muted" cx="34" cy="35" r="1.8" />
			<circle className="fill-brand-muted" cx="40" cy="35" r="1.8" />
			<circle className="fill-brand-muted" cx="22" cy="43" r="1.8" />
			<circle className="fill-brand-muted" cx="28" cy="43" r="1.8" />
			<circle className="fill-brand" cx="34" cy="43" r="3.2" />
			<circle className="fill-brand-muted" cx="40" cy="43" r="1.8" />
		</>
	),
	coin: (
		<>
			<path
				className="fill-brand-muted"
				d="M52 9.5 53.8 13.5 57.8 15.3 53.8 17.1 52 21.1 50.2 17.1 46.2 15.3 50.2 13.5z"
			/>
			<path
				className="fill-brand-muted"
				d="M53 38.5 54.2 41 56.7 42.2 54.2 43.4 53 45.9 51.8 43.4 49.3 42.2 51.8 41z"
			/>
			<circle className="fill-brand-hover" cx="31" cy="33" r="16" />
			<circle className="fill-brand" cx="34" cy="30" r="16" />
			<circle
				className="stroke-on-brand"
				cx="34"
				cy="30"
				r="13"
				fill="none"
				strokeWidth="1.6"
				opacity="0.45"
			/>
			<path
				className="stroke-on-brand"
				d="M34 20.5v19"
				strokeWidth="2.2"
				strokeLinecap="round"
			/>
			<path
				className="stroke-on-brand"
				d="M38 24.5c-.8-1.5-2.5-2.2-4.5-2.2-2.8 0-4.5 1.5-4.5 3.5 0 2.8 3.5 3.3 5.5 4.2 2.5 1.2 4 2.5 4 5 0 2.5-2 4.2-4.5 4.2-2.5 0-4.5-1.2-5.5-3"
				fill="none"
				strokeWidth="2.6"
				strokeLinecap="round"
			/>
			<path
				className="fill-brand-hover"
				d="M8 48v5c0 3 6.3 5.5 14 5.5s14-2.5 14-5.5v-5Z"
			/>
			<ellipse className="fill-brand-muted" cx="22" cy="48" rx="14" ry="5.5" />
			<ellipse
				className="stroke-surface"
				cx="22"
				cy="48"
				rx="10.5"
				ry="3.8"
				fill="none"
				strokeWidth="1.2"
				opacity="0.5"
			/>
		</>
	),
	news: (
		<>
			<path
				className="fill-brand-muted"
				d="M51 6.5 52.8 10.5 56.8 12.3 52.8 14.1 51 18.1 49.2 14.1 45.2 12.3 49.2 10.5z"
			/>
			<rect className="fill-brand" x="11" y="11" width="42" height="44" rx="6" />
			<path
				className="stroke-brand-muted"
				d="M49 16v38a4 4 0 0 1-4 4H16"
				fill="none"
				strokeWidth="2.5"
			/>
			<rect className="fill-on-brand" x="15" y="15" width="34" height="36" rx="4" />
			<rect className="fill-brand" x="19" y="19" width="26" height="5" rx="1.5" />
			<rect
				className="fill-brand-muted"
				x="19"
				y="27"
				width="12"
				height="11"
				rx="2"
			/>
			<rect className="fill-brand" x="33" y="27" width="12" height="2.8" rx="1.4" />
			<rect
				className="fill-brand-muted"
				x="33"
				y="32"
				width="10"
				height="2.2"
				rx="1.1"
			/>
			<rect
				className="fill-brand-muted"
				x="33"
				y="36"
				width="8"
				height="2.2"
				rx="1.1"
			/>
			<rect
				className="fill-brand-muted"
				x="19"
				y="41"
				width="11"
				height="2"
				rx="1"
			/>
			<rect
				className="fill-brand-muted"
				x="19"
				y="45"
				width="8"
				height="2"
				rx="1"
			/>
			<rect
				className="fill-brand-muted"
				x="33"
				y="41"
				width="12"
				height="2"
				rx="1"
			/>
			<rect
				className="fill-brand-muted"
				x="33"
				y="45"
				width="9"
				height="2"
				rx="1"
			/>
		</>
	),
	outlineNewspaper: (
		<>
			<path
				className="fill-brand-muted"
				d="M51 6.5 52.8 10.5 56.8 12.3 52.8 14.1 51 18.1 49.2 14.1 45.2 12.3 49.2 10.5z"
			/>
			<rect className="fill-brand" x="11" y="11" width="42" height="44" rx="6" />
			<path
				className="stroke-brand-muted"
				d="M49 16v38a4 4 0 0 1-4 4H16"
				fill="none"
				strokeWidth="2.5"
			/>
			<rect className="fill-on-brand" x="15" y="15" width="34" height="36" rx="4" />
			<rect className="fill-brand" x="19" y="19" width="26" height="5" rx="1.5" />
			<rect
				className="fill-brand-muted"
				x="19"
				y="27"
				width="12"
				height="11"
				rx="2"
			/>
			<rect className="fill-brand" x="33" y="27" width="12" height="2.8" rx="1.4" />
			<rect
				className="fill-brand-muted"
				x="33"
				y="32"
				width="10"
				height="2.2"
				rx="1.1"
			/>
			<rect
				className="fill-brand-muted"
				x="33"
				y="36"
				width="8"
				height="2.2"
				rx="1.1"
			/>
			<rect
				className="fill-brand-muted"
				x="19"
				y="41"
				width="11"
				height="2"
				rx="1"
			/>
			<rect
				className="fill-brand-muted"
				x="19"
				y="45"
				width="8"
				height="2"
				rx="1"
			/>
			<rect
				className="fill-brand-muted"
				x="33"
				y="41"
				width="12"
				height="2"
				rx="1"
			/>
			<rect
				className="fill-brand-muted"
				x="33"
				y="45"
				width="9"
				height="2"
				rx="1"
			/>
		</>
	),
	users: (
		<>
			<path
				className="fill-brand-muted"
				d="M53 7.5 54.8 11.5 58.8 13.3 54.8 15.1 53 19.1 51.2 15.1 47.2 13.3 51.2 11.5z"
			/>
			<path
				className="fill-brand-muted"
				d="M11 13.5 12.2 16 14.7 17.2 12.2 18.4 11 20.9 9.8 18.4 7.3 17.2 9.8 16z"
			/>
			<circle className="fill-brand-muted" cx="19" cy="24" r="7.5" />
			<path
				className="fill-brand-muted"
				d="M6 53c0-9 6-15 14-15 3.5 0 6.5 1.2 8.8 3.5-2.2 3.2-3.8 7.3-3.8 12.5v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z"
			/>
			<circle className="fill-brand-muted" cx="45" cy="24" r="7.5" />
			<path
				className="fill-brand-muted"
				d="M58 53c0-9-6-15-14-15-3.5 0-6.5 1.2-8.8 3.5 2.2 3.2 3.8 7.3 3.8 12.5v1a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2Z"
			/>
			<circle
				className="fill-brand stroke-surface"
				strokeWidth="3"
				cx="32"
				cy="19"
				r="10"
			/>
			<path
				className="fill-brand stroke-surface"
				strokeWidth="3"
				d="M14 55c0-10.5 8-18 18-18s18 7.5 18 18a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3Z"
			/>
			<path
				className="stroke-on-brand"
				d="M28 42c1.5 2 2.5 3 4 3s2.5-1 4-3"
				fill="none"
				strokeWidth="2.2"
				strokeLinecap="round"
			/>
		</>
	),
	consent: (
		<>
			<path
				className="fill-brand-muted"
				d="M53 6.5 54.8 10.5 58.8 12.3 54.8 14.1 53 18.1 51.2 14.1 47.2 12.3 51.2 10.5z"
			/>
			<path
				className="fill-brand"
				d="M28 6 47 12.5V28c0 12.5-8 21.5-19 27C17 49.5 9 40.5 9 28V12.5Z"
			/>
			<path className="fill-brand-muted" d="M28 6v49C17 49.5 9 40.5 9 28V12.5Z" />
			<circle
				className="fill-brand-hover stroke-surface"
				strokeWidth="3"
				cx="47"
				cy="46"
				r="11"
			/>
			<path
				className="stroke-on-brand"
				d="m42 46 3.6 3.7 6.6-7.4"
				fill="none"
				strokeWidth="2.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</>
	),
	unavailable: (
		<>
			<path
				className="fill-brand-muted"
				d="M54 5.5 55.8 9.5 59.8 11.3 55.8 13.1 54 17.1 52.2 13.1 48.2 11.3 52.2 9.5z"
			/>
			<rect className="fill-brand" x="6" y="14" width="46" height="40" rx="7" />
			<rect className="fill-on-brand" x="10" y="18" width="38" height="32" rx="4" />
			<rect
				className="fill-brand-muted"
				x="16"
				y="25"
				width="26"
				height="4"
				rx="2"
			/>
			<rect
				className="fill-brand-muted"
				x="16"
				y="34"
				width="18"
				height="4"
				rx="2"
			/>
			<circle
				className="fill-brand-hover stroke-surface"
				strokeWidth="3"
				cx="49"
				cy="47"
				r="10"
			/>
			<path
				className="stroke-on-brand"
				d="M44.5 47h9"
				fill="none"
				strokeWidth="2.6"
				strokeLinecap="round"
			/>
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
	return (
		<svg
			viewBox="0 0 64 64"
			aria-hidden="true"
			className={cn('size-14 shrink-0', className)}
		>
			{arts[name]}
		</svg>
	)
}
