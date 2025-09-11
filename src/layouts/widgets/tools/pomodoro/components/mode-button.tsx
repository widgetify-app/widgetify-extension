import type React from 'react'
import { Button } from '@/components/button/button'

interface ModeButtonProps {
	label: string
	mode: string
	currentMode: string
	onClick: () => void
}

export const ModeButton: React.FC<ModeButtonProps> = ({
	mode,
	label,
	currentMode,
	onClick,
}) => {
	const isActive = mode === currentMode

	return (
		<Button
			onClick={onClick}
			size="xs"
			className={`px-4 !py-2 text-xs rounded-2xl transition-colors border-none shadow-none ${isActive ? 'bg-primary text-white' : 'text-muted bg-base-300'}`}
		>
			{label}
		</Button>
	)
}
