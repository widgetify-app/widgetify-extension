import { Button } from '@/components/button/button'
import type React from 'react'

interface ControlButtonProps {
	icon: React.ReactNode
	onClick: () => void
	mode: string
}

export const ControlButton: React.FC<ControlButtonProps> = ({ icon, onClick, mode }) => {
	return (
		<Button
			onClick={onClick}
			size="md"
			className={`btn btn-circle border border-primary/30 ${['play', 'pause'].includes(mode) ? 'btn-primary' : 'btn-ghost hover:bg-primary/10 hover:text-primary'} transition-colors duration-300 ease-in-out`}
		>
			{icon}
		</Button>
	)
}
