import { motion } from 'framer-motion'
import type React from 'react'
import { FiCheck } from 'react-icons/fi'
import { modeLabels } from '../constants'
import type { TimerMode } from '../types'

interface ModeButtonProps {
	mode: TimerMode
	currentMode: TimerMode
	onClick: () => void
	getStyle: (mode: TimerMode) => string
}

export const ModeButton: React.FC<ModeButtonProps> = ({
	mode,
	currentMode,
	onClick,
	getStyle,
}) => {
	const isActive = mode === currentMode

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${getStyle(mode)}`}
		>
			{modeLabels[mode]} {isActive && <FiCheck className="inline" />}
		</motion.button>
	)
}
