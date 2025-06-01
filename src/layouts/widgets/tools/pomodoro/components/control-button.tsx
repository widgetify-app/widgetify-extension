import { Button } from '@/components/button/button'
import type React from 'react'

interface ControlButtonProps {
	icon: React.ReactNode
	onClick: () => void
	mode: string
}

export const ControlButton: React.FC<ControlButtonProps> = ({ icon, onClick, mode }) => {
	const isPrimary = ['play', 'pause'].includes(mode)
	return (
		<Button
			onClick={onClick}
			size="md"
			isPrimary={isPrimary}
			className={`btn btn-circle border border-primary/30 ${isPrimary ? '' : 'btn-ghost hover:bg-primary/10 hover:text-primary'} transition-colors duration-300 ease-in-out`}
		>
			{icon}
		</Button>
	)
}
