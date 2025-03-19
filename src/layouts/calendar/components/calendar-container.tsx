import type React from 'react'
import { useTheme } from '@/context/theme.context'

interface CalendarContainerProps {
	children: React.ReactNode
	className?: string
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
	children,
	className = '',
}) => {
	const { themeUtils } = useTheme()

	return (
		<div className={`rounded-xl ${themeUtils.getCardBackground()} ${className}`}>
			{children}
		</div>
	)
}
