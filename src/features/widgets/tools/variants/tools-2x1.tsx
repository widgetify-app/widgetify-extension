import { Icon } from '@/icons'
import { TOOLS_TABS } from '../constants'
import type { ToolsTabType } from '../types'

interface ToolsCompactRowProps {
	onSelectTab: (tab: ToolsTabType) => void
}

export function ToolsCompactRow({ onSelectTab }: ToolsCompactRowProps) {
	return (
		<fieldset
			aria-label="ابزارها"
			className="grid grid-cols-3 gap-1.5 h-full w-full min-w-0 select-none"
		>
			{TOOLS_TABS.map((tab) => (
				<button
					key={tab.id}
					type="button"
					onClick={() => onSelectTab(tab.id)}
					className="flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl cursor-pointer bg-surface-2 transition-ui hover:bg-fill-2 focus-visible:focus-ring"
				>
					<Icon
						name={tab.icon}
						className="w-4 h-4 text-fg"
						aria-hidden="true"
					/>
					<span className="text-3xs font-medium text-fg">
						{tab.compactLabel}
					</span>
				</button>
			))}
		</fieldset>
	)
}
