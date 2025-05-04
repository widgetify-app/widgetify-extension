import { getContainerBackground, useTheme } from '@/context/theme.context'

interface WidgetContainerProps {
	children: React.ReactNode
	className?: string
	background?: boolean
	style?: any
}
export function WidgetContainer({
	children,
	className,
	background = true,
	style,
}: WidgetContainerProps) {
	const { theme } = useTheme()
	return (
		<div
			className={`flex flex-col h-80 p-2 ${background && getContainerBackground(theme)} rounded-xl ${className}`}
			style={style}
		>
			{children}
		</div>
	)
}
