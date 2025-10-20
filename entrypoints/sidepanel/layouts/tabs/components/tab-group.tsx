import { useFavoriteStore } from '@/entrypoints/sidepanel/context/favorite.context'
import type { TabGroup as TabGroupType } from '../../../types/tab.types'
import { getGroupColor } from '../../../utils/color.utils'
import { TabItem } from './tab-item'

interface TabGroupProps {
	group: TabGroupType
	onSwitch: (tabId: number) => void
	onClose: (tabId: number, e: React.MouseEvent) => void
	onReload: (tabId: number, e: React.MouseEvent) => void
	onToggleMute: (tabId: number, muted: boolean, e: React.MouseEvent) => void
	onToggleFavorite: any
}

export function TabGroup({
	group,
	onSwitch,
	onClose,
	onReload,
	onToggleMute,
	onToggleFavorite,
}: TabGroupProps) {
	const { isFavorite } = useFavoriteStore()
	return (
		<div className="mb-2 collapse collapse-arrow rounded-2xl bg-base-200">
			<input type="checkbox" defaultChecked />
			<div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold collapse-title text-base-content/70">
				<div
					className="w-3 h-3 rounded-full"
					style={{ backgroundColor: getGroupColor(group.color) }}
				/>
				{group.title || 'بدون نام'}
			</div>
			<div className="collapse-content">
				{group.tabs.map((tab) => (
					<TabItem
						key={tab.id}
						tab={tab}
						onSwitch={onSwitch}
						onClose={onClose}
						onReload={onReload}
						onToggleMute={onToggleMute}
						onToggleFavorite={onToggleFavorite}
						isFavorite={isFavorite(tab.url)}
					/>
				))}
			</div>
		</div>
	)
}
