import { getBorderColor, getCardBackground, useTheme } from '@/context/theme.context'

interface ContextMenuProps {
	position: { x: number; y: number }
	children: React.ReactNode
}

export function ContextMenu({ position, children }: ContextMenuProps) {
	const { theme } = useTheme()

	return (
		<div
			className={`absolute p-2 min-w-[150px] rounded-lg ${getCardBackground(theme)} shadow-md  border-1 ${getBorderColor(theme)}`}
			style={{ top: position.y, left: position.x, zIndex: 1000 }}
			onClick={(e) => e.stopPropagation()}
		>
			{children}
		</div>
	)
}
