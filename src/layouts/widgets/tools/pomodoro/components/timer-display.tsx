import type React from 'react'
import { modeFullLabels } from '../constants'
import type { TimerMode } from '../types'

interface TimerDisplayProps {
	timeLeft: number
	progress: number
	mode: TimerMode
	getProgressColor: () => string
	cycles: number
	cyclesBeforeLongBreak: number
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
	timeLeft,
	progress,
	mode,
	getProgressColor,
	cycles,
	cyclesBeforeLongBreak,
}) => {
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}
	return (
		<div className="relative mx-auto mb-6 w-36 h-36 animate-in zoom-in-95 duration-300">
			<svg className="w-full h-full" viewBox="0 0 100 100">
				{/* Background circle */}
				<circle
					cx="50"
					cy="50"
					r="45"
					fill="none"
					stroke="#f3f4f6"
					strokeWidth="5"
				/>{' '}
				{/* Progress circle with animation */}
				<circle
					cx="50"
					cy="50"
					r="45"
					fill="none"
					stroke={getProgressColor()}
					strokeWidth="5"
					strokeDasharray="283"
					strokeDashoffset={283 - (283 * progress) / 100}
					transform="rotate(-90 50 50)"
					className="transition-all duration-500 ease-out"
				/>
				{/* Timer text */}
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
				<text x="50" y="65" textAnchor="middle" fontSize="6" fill="#6b7280">
					{modeFullLabels[mode]}
				</text>
			</svg>{' '}
			{/* Cycle indicator */}
			<div className="absolute flex space-x-1 -translate-x-1/2 left-1/2">
				{Array.from({ length: cyclesBeforeLongBreak }).map((_, i) => (
					<div
						key={i}
						className={`w-2 h-2 rounded-full transition-all duration-300 ${
							i < cycles % cyclesBeforeLongBreak
								? 'bg-blue-500 scale-100'
								: 'bg-gray-700 scale-75'
						}`}
					/>
				))}
			</div>
		</div>
	)
}
