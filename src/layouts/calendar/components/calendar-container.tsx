import { getContainerBackground } from '@/context/theme.context'
import type React from 'react'

interface CalendarContainerProps {
	children: React.ReactNode
	className?: string
	theme: string
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
	children,
	className = '',
	theme,
}) => {
	return (
		<div className={`rounded-xl ${getContainerBackground(theme)} ${className}`}>
			{children}
		</div>
	)
}
