import type { ReactElement } from 'react'
import { cn } from '@/common/utils/cn'

const arts = {
	tasks: (
		<>
			<path
				className="fill-warning"
				d="M13 7.5 15 12l4.5 2L15 16l-2 4.5L11 16l-4.5-2L11 12z"
			/>
			<rect className="fill-brand" x="14" y="6" width="38" height="50" rx="7" />
			<rect className="fill-on-brand" x="18" y="10" width="30" height="42" rx="4" />
			<circle className="fill-success" cx="25" cy="20" r="3.6" />
			<path
				className="stroke-on-success"
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
			<rect className="fill-warning" x="48" y="14" width="9" height="5" rx="2.5" />
			<rect className="fill-warning" x="48" y="27" width="9" height="5" rx="2.5" />
			<rect className="fill-warning" x="48" y="40" width="9" height="5" rx="2.5" />
		</>
	),
	habits: (
		<>
			<path
				className="fill-success"
				d="M32 30C21 30 15 23 15 13c11 0 17 6 17 17Z"
			/>
			<path className="fill-brand" d="M32 24c0-9 5-15 16-15 0 9-5 15-16 15Z" />
			<path
				className="stroke-success"
				d="M32 40V22"
				fill="none"
				strokeWidth="3.2"
				strokeLinecap="round"
			/>
			<path
				className="fill-warning"
				d="M17 39h30l-3.4 16.2A4 4 0 0 1 39.7 58H24.3a4 4 0 0 1-3.9-2.8z"
			/>
			<rect className="fill-warning" x="14" y="35" width="36" height="7" rx="3.5" />
			<path
				className="fill-info"
				d="M54 14c0 0-5 5.8-5 9.2a5 5 0 0 0 10 0C59 19.8 54 14 54 14Z"
			/>
		</>
	),
	notes: (
		<>
			<path
				className="fill-warning"
				d="M12 13a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v28L36 53H18a6 6 0 0 1-6-6Z"
			/>
			<path
				className="fill-on-warning"
				opacity="0.3"
				d="M48 41 36 53v-6a6 6 0 0 1 6-6Z"
			/>
			<rect
				className="fill-on-warning"
				opacity="0.55"
				x="19"
				y="16"
				width="22"
				height="3.4"
				rx="1.7"
			/>
			<rect
				className="fill-on-warning"
				opacity="0.55"
				x="19"
				y="26"
				width="22"
				height="3.4"
				rx="1.7"
			/>
			<rect
				className="fill-on-warning"
				opacity="0.55"
				x="19"
				y="36"
				width="12"
				height="3.4"
				rx="1.7"
			/>
			<g transform="rotate(32 49 40)">
				<rect
					className="fill-danger"
					x="44.5"
					y="20"
					width="9"
					height="6"
					rx="2.5"
				/>
				<rect className="fill-brand" x="44.5" y="26" width="9" height="26" />
				<path className="fill-fg-muted" d="M44.5 52h9L49 61Z" />
			</g>
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
