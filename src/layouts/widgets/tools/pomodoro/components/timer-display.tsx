import type React from 'react'
import { modeFullLabels } from '../constants'
import type { TimerMode } from '../types'

export const modeColors = {
	work: 'stroke-primary',
	'short-break': 'stroke-success',
	'long-break': 'stroke-warning',
}

interface TimerDisplayProps {
	timeLeft: number
	progress: number
	mode: TimerMode
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
	timeLeft,
	progress,
	mode,
}) => {
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}
	return (
		<div className="relative mx-auto mt-4 duration-300 w-36 h-36 animate-in zoom-in-95">
			<svg className="w-full h-full" viewBox="0 0 100 100">
				<circle
					cx="50"
					cy="50"
					r="45"
					fill="none"
					stroke="#f3f4f6"
					strokeWidth="5"
					filter="url(#shadow)"
				/>
				{/* Progress circle with gradient and smooth animation */}
				<circle
					cx="50"
					cy="50"
					r="45"
					fill="none"
					stroke="url(#progressGradient)"
					strokeWidth="5"
					strokeDasharray="283"
					strokeDashoffset={283 - (283 * progress) / 100}
					transform="rotate(-90 50 50)"
					className={`transition-all duration-1000 ease-out ${modeColors[mode]}`}
					strokeLinecap="round"
				/>
				<circle
					cx="50"
					cy="50"
					r="40"
					fill="none"
					stroke="#ffffff10"
					strokeWidth="1"
				/>
				<text
					x="50"
					y="50"
					className={'text-base-content'}
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize="16"
					fontWeight="bold"
					fill="currentColor"
				>
					{formatTime(timeLeft)}
				</text>
				{/* Current mode text */}
				<text
					x="50"
					y="65"
					textAnchor="middle"
					fontSize="7"
					fill="currentColor"
					className={'text-muted'}
				>
					{modeFullLabels[mode]}
				</text>
			</svg>{' '}
		</div>
	)
}
