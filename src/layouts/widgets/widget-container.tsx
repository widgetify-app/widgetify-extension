import { getContainerBackground, useTheme } from '@/context/theme.context'

interface WidgetContainerProps {
	children: React.ReactNode
	className?: string
}
export function WidgetContainer({ children, className }: WidgetContainerProps) {
	const { theme } = useTheme()
	return (
		<div
			className={`flex flex-col h-80 p-2 ${getContainerBackground(theme)} rounded-xl ${className}`}
		>
			{children}
		</div>
	)
}
