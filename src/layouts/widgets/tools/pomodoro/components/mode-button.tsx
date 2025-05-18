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
			className={`px-3 py-1 btn-ghost text-xs font-medium rounded-md transition-colors border border-base-100 ${isActive && 'bg-primary/10 text-primary'}`}
		>
			{modeLabels[mode]} {isActive && <FiCheck className="inline" />}
		</Button>
	)
}
