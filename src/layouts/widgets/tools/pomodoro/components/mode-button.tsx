import { Button } from '@/components/button/button'
import type React from 'react'
import { FiCheck } from 'react-icons/fi'
import { modeLabels } from '../constants'
import type { TimerMode } from '../types'

interface ModeButtonProps {
	mode: TimerMode
	currentMode: TimerMode
	onClick: () => void
}

export const ModeButton: React.FC<ModeButtonProps> = ({ mode, currentMode, onClick }) => {
	const isActive = mode === currentMode

	return (
		<Button
			onClick={onClick}
			size="xs"
			className={`px-4 !py-2 text-xs font-medium rounded-2xl transition-colors border-none shadow-none ${isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}
		>
			{modeLabels[mode]}
		</Button>
	)
}
