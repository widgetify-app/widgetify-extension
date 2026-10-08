import type React from 'react'
import { Badge, Button, Chip, ScrollRow, VipBadge } from '@/components/ui'
import { cn } from '@/common/utils/cn'
import type {
	WidgetCategory,
	WidgetDefinition,
} from '@/features/widgets/utils/layout-engine/types'
import type { WidgetTabKeys } from '@/features/widgets/types'
import { Icon } from '@/icons'
import { CATEGORIES, type CategoryItem } from '../types'
import { t } from '@/common/i18n'

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
			<div className="pb-2 mb-2 border-b shrink-0 border-line">
				<ScrollRow>
					{categories.map((cat) => (
						<Chip
							onClick={() => onSelectCategory(cat.id)}
							key={cat.id}
							size="sm"
							selected={activeCategory === cat.id}
							className="shrink-0"
						>
							{t(cat.labelKey)}
						</Chip>
					))}
				</ScrollRow>
			</div>

			<div className="space-y-1.5 pr-0.5 scrollbar-none md:flex-1 md:overflow-y-auto">
				{definitions.length === 0 ? (
					<div className="flex items-center justify-center h-32 text-xs text-fg-muted">
						{t('widgets.catalog.emptyCategory')}
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
										: 'bg-surface-2 hover:bg-surface-3 border-surface-3'
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
										{t(def.label)}
									</span>
									{isWidgetNew?.(def.id) && (
										<Badge>{t('widgets.catalog.badge.new')}</Badge>
									)}
								</button>

								<div className="flex items-center gap-1.5 shrink-0 mr-2">
									{!isVip && isWidgetVipOnly(def.id) && (
										<VipBadge size="xs" text={t('ui.vip.pro')} />
									)}
									{def.settingsTab && (
										<Button
											type="button"
											onClick={(e) =>
												onOpenWidgetSettings(e, def.settingsTab)
											}
											aria-label={t(
												'widgets.catalog.widgetSettings'
											)}
											size={'xs'}
											variant={'ghost'}
											className="relative z-10 px-1!"
											rounded={'full'}
										>
											<Icon name="settings" size={12} />
										</Button>
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
												{isActive
													? `${count}`
													: t('widgets.catalog.repeatable')}
											</span>
										</span>
									) : isActive ? (
										<span className="text-3xs px-1.5 py-0.5 rounded-lg bg-surface-3 text-fg-muted font-medium">
											{t('widgets.catalog.active')}
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
