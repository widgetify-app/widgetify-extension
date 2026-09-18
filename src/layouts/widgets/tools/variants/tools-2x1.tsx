import { Icon } from '@/icons'
import { TOOLS_TABS } from '../constants'
import type { ToolsTabType } from '../types'

interface ToolsCompactRowProps {
	onSelectTab: (tab: ToolsTabType) => void
}

export function ToolsCompactRow({ onSelectTab }: ToolsCompactRowProps) {
	return (
		<div
			role="group"
			aria-label="ابزارها"
			className="grid grid-cols-3 gap-1.5 h-full w-full select-none"
		>
			{TOOLS_TABS.map((tab) => (
				<button
					key={tab.id}
					type="button"
					onClick={() => onSelectTab(tab.id)}
					className="flex flex-col items-center justify-center gap-1 p-1.5 border rounded-xl cursor-pointer bg-raised border-subtle transition-ui hover:bg-raised focus-visible:focus-ring"
				>
					<Icon
						name={tab.icon}
						className="w-4 h-4 text-primary"
						aria-hidden="true"
					/>
					<span className="text-[10px] font-medium text-content">
						{tab.compactLabel}
					</span>
				</button>
			))}
		</div>
	)
}
