import type React from 'react'
import { cn } from '@/common/utils/cn'
import type { TimerMode } from '../types'
import { formatTimer } from '../../utils/pomodoro-time'

const RADIUS = 46

interface TimerDisplayProps {
	timeLeft: number
	progress: number
	mode: TimerMode
	label: string
	isLarge?: boolean
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
	timeLeft,
	progress,
	mode,
	label,
	isLarge = false,
}) => (
	<div
		role="timer"
		aria-label={`${formatTimer(timeLeft)}، ${label}`}
		className={cn(
			'relative grid place-items-center shrink-0',
			isLarge ? 'size-40' : 'size-32'
		)}
	>
		<svg
			aria-hidden="true"
			className="absolute inset-0 -rotate-90 size-full"
			viewBox="0 0 100 100"
		>
			<circle
				cx="50"
				cy="50"
				r={RADIUS}
				fill="none"
				className="stroke-fill-2"
				strokeWidth="4"
			/>
			<circle
				cx="50"
				cy="50"
				r={RADIUS}
				fill="none"
				strokeWidth="4"
				strokeLinecap="round"
				pathLength={100}
				strokeDasharray={`${progress} 100`}
				className={cn(
					'transition-[stroke-dasharray] duration-1000 ease-out',
					mode === 'work' ? 'stroke-brand' : 'stroke-success'
				)}
			/>
		</svg>
		<span aria-hidden="true" className="relative flex flex-col items-center">
			<span
				className={cn(
					'font-extrabold leading-none tabular-nums text-fg-strong',
					isLarge ? 'text-3xl' : 'text-2xl'
				)}
			>
				{formatTimer(timeLeft)}
			</span>
			<span className="mt-1 text-3xs text-fg-faint">{label}</span>
		</span>
	</div>
)
