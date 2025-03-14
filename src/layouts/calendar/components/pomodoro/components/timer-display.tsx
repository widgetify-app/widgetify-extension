import { motion } from 'framer-motion'
import type React from 'react'
import { modeFullLabels } from '../constants'
import type { TimerMode } from '../types'

interface TimerDisplayProps {
	timeLeft: number
	progress: number
	mode: TimerMode
	theme: string
	getProgressColor: () => string
	getTextStyle: () => string
	cycles: number
	cyclesBeforeLongBreak: number
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
	timeLeft,
	progress,
	mode,
	theme,
	getProgressColor,
	getTextStyle,
	cycles,
	cyclesBeforeLongBreak,
}) => {
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}

	return (
		<motion.div
			initial={{ scale: 0.9 }}
			animate={{ scale: 1 }}
			transition={{ type: 'spring', stiffness: 200, damping: 20 }}
			className="relative w-48 h-48 mx-auto mb-6"
		>
			<svg className="w-full h-full" viewBox="0 0 100 100">
				{/* Background circle */}
				<circle
					cx="50"
					cy="50"
					r="45"
					fill="none"
					stroke={theme === 'light' ? '#f3f4f6' : 'rgba(255,255,255,0.1)'}
					strokeWidth="5"
				/>

				{/* Progress circle with animation */}
				<motion.circle
					initial={{ strokeDashoffset: 283 }}
					animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
					transition={{ duration: 0.5 }}
					cx="50"
					cy="50"
					r="45"
					fill="none"
					stroke={getProgressColor()}
					strokeWidth="5"
					strokeDasharray="283"
					transform="rotate(-90 50 50)"
				/>

				{/* Timer text */}
				<text
					x="50"
					y="50"
					className={getTextStyle()}
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
					fontSize="6"
					fill={theme === 'light' ? '#6b7280' : '#9ca3af'}
				>
					{modeFullLabels[mode]}
				</text>
			</svg>

			{/* Cycle indicator */}
			<div className="absolute flex space-x-1 -translate-x-1/2 left-1/2">
				{Array.from({ length: cyclesBeforeLongBreak }).map((_, i) => (
					<motion.div
						key={i}
						initial={{ scale: 0.8 }}
						animate={{ scale: i < cycles % cyclesBeforeLongBreak ? 1 : 0.8 }}
						className={`w-2 h-2 rounded-full ${
							i < (cycles % cyclesBeforeLongBreak)
								? 'bg-blue-500'
								: theme === 'light'
									? 'bg-gray-200'
									: 'bg-gray-700'
						}`}
					/>
				))}
			</div>
		</motion.div>
	)
}
