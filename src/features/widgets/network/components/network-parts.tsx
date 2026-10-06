import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { getPingBars, getPingLabel, getPingTextClass } from '../utils/ping-quality'

const BAR_HEIGHTS = ['h-1.25', 'h-2', 'h-2.75', 'h-3.5']

interface NetworkStatusProps {
	isOnline: boolean
	className?: string
}

export function NetworkStatus({ isOnline, className }: NetworkStatusProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1.5 font-semibold',
				isOnline ? 'text-success' : 'text-danger',
				className
			)}
		>
			<span
				aria-hidden="true"
				className="flex-none rounded-full size-1.5 bg-current"
			/>
			{isOnline ? 'متصل' : 'قطع'}
		</span>
	)
}

export function PingSignal({ ping }: { ping: number | null }) {
	const litBars = getPingBars(ping)

	return (
		<span
			className={cn(
				'flex items-center gap-1.5 font-semibold text-2xs',
				getPingTextClass(ping)
			)}
		>
			{getPingLabel(ping)}
			<span aria-hidden="true" dir="ltr" className="flex items-end h-3.5 gap-0.5">
				{BAR_HEIGHTS.map((height, index) => (
					<span
						key={height}
						className={cn(
							'w-1 rounded-xs',
							height,
							index < litBars ? 'bg-current' : 'bg-fill-3'
						)}
					/>
				))}
			</span>
		</span>
	)
}

export function CountryFlag({ src }: { src: string | null }) {
	if (!src) {
		return (
			<span className="grid flex-none rounded-full size-6.5 place-items-center bg-fill text-fg-muted">
				<Icon name="globe" size={14} aria-hidden="true" />
			</span>
		)
	}

	return (
		<img
			src={src}
			alt=""
			className="flex-none object-cover rounded-full size-6.5 ring-1 ring-line"
		/>
	)
}
