import type React from 'react'
import { Button, ProBadge } from '@/components/ui'
import { cn } from '@/common/utils/cn'
import type {
	WidgetCategory,
	WidgetDefinition,
} from '@/layouts/widgets/layout-engine/types'
import type { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { Icon } from '@/src/icons'
import { CATEGORIES } from './types'

interface AddWidgetSidebarProps {
	activeCategory: WidgetCategory
	onSelectCategory: (category: WidgetCategory) => void
	definitions: WidgetDefinition[]
	selectedId: string
	onSelectWidget: (id: string) => void
	runtimeLayout: { id: string }[]
	visibility: string[]
	isVip?: boolean
	isWidgetVipOnly: (id: string) => boolean
	onOpenWidgetSettings: (e: React.MouseEvent, settingsTab?: WidgetTabKeys) => void
}

export function AddWidgetSidebar({
	activeCategory,
	onSelectCategory,
	definitions,
	selectedId,
	onSelectWidget,
	runtimeLayout,
	visibility,
	isVip = false,
	isWidgetVipOnly,
	onOpenWidgetSettings,
}: AddWidgetSidebarProps) {
	return (
		<div className="flex flex-col w-full pb-3 pl-0 border-b md:w-5/12 md:border-b-0 md:border-l border-base-content/10 md:pl-3 md:pb-0">
			<div className="flex items-center gap-1 pb-2 mb-2 overflow-x-auto border-b scrollbar-none border-base-content/10">
				{CATEGORIES.map((cat) => (
					<button
						key={cat.id}
						type="button"
						onClick={() => onSelectCategory(cat.id)}
						className={cn(
							'px-2.5 py-1 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-medium',
							activeCategory === cat.id
								? 'bg-primary text-white font-bold shadow-xs'
								: 'bg-base-200/60 hover:bg-base-200 text-muted'
						)}
					>
						{cat.label}
					</button>
				))}
			</div>

			<div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-none">
				{definitions.map((def) => {
					const isSelected = def.id === selectedId
					const count = runtimeLayout.filter((w) => w.id === def.id).length
					const isActive = count > 0

					return (
						<div
							key={def.id}
							onClick={() => onSelectWidget(def.id)}
							className={cn(
								'w-full flex items-center justify-between p-2.5 rounded-2xl border text-right transition-all duration-150 cursor-pointer',
								isSelected
									? 'bg-primary/10 border-primary shadow-xs'
									: 'bg-base-200/60 hover:bg-base-200 border-base-content/10'
							)}
						>
							<div className="flex items-center min-w-0 gap-2">
								<span className="text-xl shrink-0">{def.emoji}</span>
								<span
									className={cn(
										'text-xs truncate',
										isSelected
											? 'font-bold text-primary'
											: 'font-medium text-content'
									)}
								>
									{def.label}
								</span>
							</div>

							<div className="flex items-center gap-1.5 shrink-0 mr-2">
								{!isVip && isWidgetVipOnly(def.id) && (
									<ProBadge size="xs" />
								)}
								{def.settingsTab && (
									<Button
										type="button"
										onClick={(e) =>
											onOpenWidgetSettings(e, def.settingsTab)
										}
										title="تنظیمات ویجت"
										size={'xs'}
										variant={'ghost'}
										className="px-1!"
										rounded={'full'}
									>
										<Icon name="settings" size={13} />
									</Button>
								)}
								{def.canDuplicate ? (
									<span
										className={cn(
											'text-[10px] px-1.5 py-0.5 rounded-lg font-medium flex items-center gap-1',
											isActive
												? 'bg-primary/15 text-primary'
												: 'bg-base-300 text-muted'
										)}
									>
										<span>
											{isActive ? `${count} فعال` : 'تکرار'}
										</span>
									</span>
								) : isActive ? (
									<span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-base-300 text-muted font-medium">
										فعال
									</span>
								) : null}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
