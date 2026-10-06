import type { ReactNode } from 'react'
import { WidgetHeader } from '@/features/widgets/components/widget-header'

interface ToolHeaderProps {
	tabs?: ReactNode
	title?: string
	leading?: ReactNode
	info?: ReactNode
	actions?: ReactNode
}

export function ToolHeader({ tabs, title, leading, info, actions }: ToolHeaderProps) {
	if (tabs) {
		return (
			<WidgetHeader
				title={title ?? tabs}
				leading={leading}
				info={info}
				actions={actions}
			/>
		)
	}

	if (!leading && !title && !actions) return null

	return (
		<header className="flex items-center flex-none h-7 gap-2">
			{leading}
			{title && <h3 className="text-xs font-bold text-fg-strong">{title}</h3>}
			<span className="flex-1" />
			{actions}
		</header>
	)
}
