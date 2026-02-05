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
			className={`rounded-full p-0! w-10 text-center  border-none shadow-none transition-colors duration-300 ease-in-out`}
		>
			{icon}
		</Button>
	)
}
