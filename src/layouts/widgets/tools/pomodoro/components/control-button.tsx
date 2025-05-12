import { getButtonStyles, getTextColor } from '@/context/theme.context'
import { motion } from 'framer-motion'
import type React from 'react'

interface ControlButtonProps {
	icon: React.ReactNode
	onClick: () => void
	theme: string
	mode: string
}

export const ControlButton: React.FC<ControlButtonProps> = ({
	icon,
	onClick,
	theme,
	mode,
}) => {
	const bg =
		mode === 'pause'
			? 'bg-red-500'
			: getButtonStyles(theme, ['play', 'pause'].includes(mode))

	return (
		<motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className={`${getTextColor(theme)} cursor-pointer  shadow-md transition-colors  !rounded-full !p-3 ${bg}`}
		>
			{icon}
		</motion.button>
	)
}
