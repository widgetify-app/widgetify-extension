import { motion } from 'framer-motion'
import type React from 'react'

interface ControlButtonProps {
	icon: React.ReactNode
	onClick: () => void
	color: string
}

export const ControlButton: React.FC<ControlButtonProps> = ({ icon, onClick, color }) => {
	return (
		<motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className={`p-3 text-white rounded-full shadow-md transition-colors ${color}`}
		>
			{icon}
		</motion.button>
	)
}
