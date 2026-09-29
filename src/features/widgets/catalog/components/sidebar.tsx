import type React from 'react'
import { Badge, Button, Tooltip, VipBadge } from '@/components/ui'
import { cn } from '@/common/utils/cn'
import type {
	WidgetCategory,
	WidgetDefinition,
} from '@/features/widgets/utils/layout-engine/types'
import type { WidgetTabKeys } from '@/features/widgets/types'
import { Icon } from '@/icons'
import { CATEGORIES, type CategoryItem } from '../types'

interface AddWidgetSidebarProps {
	activeCategory: WidgetCategory
	onSelectCategory: (category: WidgetCategory) => void
	definitions: WidgetDefinition[]
	selectedId: string
	onSelectWidget: (id: string) => void
	runtimeLayout: { id: string }[]
	isVip?: boolean
	isWidgetVipOnly: (id: string) => boolean
	isWidgetNew?: (id: string) => boolean
	categories?: CategoryItem[]
	onOpenWidgetSettings: (e: React.MouseEvent, settingsTab?: WidgetTabKeys) => void
}

export function AddWidgetSidebar({
	activeCategory,
	onSelectCategory,
	definitions,
	selectedId,
	onSelectWidget,
	runtimeLayout,
	isVip = false,
	isWidgetVipOnly,
	isWidgetNew,
	categories = CATEGORIES,
	onOpenWidgetSettings,
}: AddWidgetSidebarProps) {
	return (
		<div className="flex flex-col w-full pb-3 pl-0 border-b md:min-h-0 md:w-5/12 md:border-b-0 md:border-l border-line md:pl-3 md:pb-0">
			<div className="flex items-center gap-1 pb-2 mb-2 overflow-x-auto border-b shrink-0 scrollbar-none border-line">
				{categories.map((cat) => (
					<button
						key={cat.id}
						type="button"
						onClick={() => onSelectCategory(cat.id)}
						className={cn(
							'px-2.5 py-1 rounded-xl text-xs whitespace-nowrap transition-ui cursor-pointer font-medium',
							activeCategory === cat.id
								? 'bg-brand text-on-brand font-bold shadow-sm'
								: 'bg-fill-2 hover:bg-surface-2 text-fg-muted'
						)}
					>
						{cat.label}
					</button>
				))}
			</div>

			<div className="space-y-1.5 pr-0.5 scrollbar-none md:flex-1 md:overflow-y-auto">
				{definitions.length === 0 ? (
					<div className="flex items-center justify-center h-32 text-xs text-fg-muted">
						ویجتی در این دسته‌بندی یافت نشد
					</div>
				) : (
					definitions.map((def) => {
						const isSelected = def.id === selectedId
						const count = runtimeLayout.filter((w) => w.id === def.id).length
						const isActive = count > 0

						return (
							<div
								key={def.id}
								className={cn(
									'relative w-full flex items-center justify-between p-2.5 rounded-2xl border text-right transition-ui duration-150',
									isSelected
										? 'bg-brand-fill border-brand shadow-sm'
										: 'bg-fill-2 hover:bg-surface-2 border-line'
								)}
							>
								<button
									type="button"
									onClick={() => onSelectWidget(def.id)}
									aria-pressed={isSelected}
									className="flex items-center min-w-0 gap-2 text-start cursor-pointer after:absolute after:inset-0 after:rounded-2xl focus-visible:focus-ring"
								>
									<span
										className={cn(
											'flex items-center justify-center rounded-xl w-7 h-7 shrink-0 transition-ui',
											isSelected
												? 'bg-brand-fill text-brand'
												: 'bg-fill text-fg-muted'
										)}
									>
										<Icon name={def.icon} size={16} />
									</span>
									<span
										className={cn(
											'text-xs truncate',
											isSelected
												? 'font-bold text-brand'
												: 'font-medium text-fg'
										)}
									>
										{def.label}
									</span>
									{isWidgetNew?.(def.id) && <Badge>جدید</Badge>}
								</button>

								<div className="flex items-center gap-1.5 shrink-0 mr-2">
									{!isVip && isWidgetVipOnly(def.id) && (
										<VipBadge size="xs" />
									)}
									{def.settingsTab && (
										<Tooltip content="تنظیمات ویجت">
											<Button
												type="button"
												onClick={(e) =>
													onOpenWidgetSettings(
														e,
														def.settingsTab
													)
												}
												aria-label="تنظیمات ویجت"
												size={'xs'}
												variant={'ghost'}
												className="relative z-10 px-1!"
												rounded={'full'}
											>
												<Icon name="settings" size={12} />
											</Button>
										</Tooltip>
									)}
									{def.canDuplicate ? (
										<span
											className={cn(
												'text-3xs px-1.5 py-0.5 rounded-lg font-medium flex items-center gap-1',
												isActive
													? 'bg-brand-fill text-brand'
													: 'bg-surface-3 text-fg-muted'
											)}
										>
											<span>
												{isActive ? `${count}` : 'قابل تکرار'}
											</span>
										</span>
									) : isActive ? (
										<span className="text-3xs px-1.5 py-0.5 rounded-lg bg-surface-3 text-fg-muted font-medium">
											فعال
										</span>
									) : null}
								</div>
							</div>
						)
					})
				)}
			</div>
		</div>
	)
}
