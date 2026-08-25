import { useMemo, useState } from 'react'
import { BottomSheet, Button } from '@/components/ui'
import { cn } from '@/common/utils/cn'
import { useAuth } from '@/context/auth.context'
import { UI, useAppearanceSetting } from '@/context/appearance.context'
import {
	MAX_VISIBLE_WIDGETS,
	useWidgetVisibility,
} from '@/context/widget-visibility.context'
import { useOptionalFreeWidgets } from '@/context/free-widget.context'
import type { WidgetCategory } from '@/layouts/widgets/layout-engine/types'
import { WIDGET_DEFINITIONS } from '@/layouts/widgets/widget-registry'
import { Icon } from '@/src/icons'
import { playNativeToastSound, showToast } from '@/common/toast'
import { WidgetHelpModal } from './widget-help.modal'

interface AddWidgetBottomSheetProps {
	isOpen: boolean
	onClose: () => void
	onOpenAdvanced: () => void
}

const CATEGORIES: { id: WidgetCategory; label: string }[] = [
	{ id: 'all', label: 'همه' },
	{ id: 'time', label: 'زمان و تاریخ' },
	{ id: 'productivity', label: 'ابزار و تسک' },
	{ id: 'info', label: 'اطلاعات و رسانه' },
	{ id: 'lifestyle', label: 'سرگرمی' },
]

export function AddWidgetBottomSheet({
	isOpen,
	onClose,
	onOpenAdvanced,
}: AddWidgetBottomSheetProps) {
	const { isAuthenticated } = useAuth()
	const { ui } = useAppearanceSetting()
	const { visibility, toggleWidget } = useWidgetVisibility()
	const freeWidgets = useOptionalFreeWidgets()

	const runtimeLayout = freeWidgets?.runtimeLayout || []
	const addWidget = freeWidgets?.addWidget

	const isCustom = ui === UI.CUSTOM
	const currentMode = isCustom ? 'CUSTOM' : 'ADVANCED'

	const [activeCategory, setActiveCategory] = useState<WidgetCategory>('all')
	const [isHelpOpen, setIsHelpOpen] = useState(false)

	const allDefinitions = useMemo(() => {
		return Object.values(WIDGET_DEFINITIONS).filter(
			(def) => !def.supportedModes || def.supportedModes.includes(currentMode)
		)
	}, [currentMode])

	const filteredDefinitions = useMemo(() => {
		if (activeCategory === 'all') return allDefinitions
		return allDefinitions.filter((def) => def.category === activeCategory)
	}, [allDefinitions, activeCategory])

	const handleAddWidget = async (widgetId: string) => {
		const def = WIDGET_DEFINITIONS[widgetId as keyof typeof WIDGET_DEFINITIONS]
		if (!def) return

		if (isCustom) {
			const activeCount = runtimeLayout.filter((w) => w.id === def.id).length
			if (!def.canDuplicate && activeCount > 0) {
				showToast('این ویجت قبلا به صفحه اضافه شده', 'info')
				return
			}

			if (addWidget) {
				const success = await addWidget(def.id, undefined, def.defaultSize)
				if (success) {
					playNativeToastSound('success')
				}
			}
		} else {
			const isActive = visibility.includes(def.id as any)
			if (
				!isActive &&
				!isAuthenticated &&
				visibility.length >= MAX_VISIBLE_WIDGETS
			) {
				showToast('حداکثر ویجت‌های مجاز فعال شده‌اند', 'error')
				return
			}
			toggleWidget(def.id as any)
			playNativeToastSound(isActive ? 'info' : 'success')
		}
	}

	const handleOpenAdvancedModal = () => {
		onClose()
		onOpenAdvanced()
	}

	if (ui === UI.SIMPLE || !isOpen) {
		return null
	}

	return (
		<BottomSheet isOpen={isOpen} onClose={onClose} size="medium">
			<div className="flex flex-col gap-3 pt-0 pb-6">
				<div className="sticky -top-2 z-10 bg-base-200 pt-1 pb-2 flex flex-col gap-3 border-b border-base-content/10">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center gap-2">
							<div>
								<h3 className="text-sm font-bold text-content leading-tight">
									افزودن ویجت
								</h3>
								<p className="text-[11px] text-muted leading-tight mt-0.5">
									برای اضافه کردن هر ویجت روی آن کلیک کنید
								</p>
							</div>
						</div>

						<div className="flex items-center gap-1.5">
							<Button
								type="button"
								variant="default"
								size="xs"
								rounded="xl"
								onClick={() => setIsHelpOpen(true)}
								className="flex items-center gap-1 text-xs text-muted hover:text-content px-2.5 py-1.5 border border-base-content/10 shadow-none"
								title="راهنمای مدیریت ویجت‌ها"
							>
								<Icon name="help" size={13} />
								<span>راهنما</span>
							</Button>

							<Button
								type="button"
								variant="default"
								size="xs"
								rounded="xl"
								onClick={handleOpenAdvancedModal}
								className="flex items-center gap-1.5 text-xs text-content hover:text-primary px-3 py-1.5 border border-base-content/10 shadow-none"
							>
								<Icon name="settings" size={13} />
								<span>تنظیمات پیشرفته</span>
							</Button>
						</div>
					</div>

					<div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
						{CATEGORIES.map((cat) => (
							<button
								key={cat.id}
								type="button"
								onClick={() => setActiveCategory(cat.id)}
								className={cn(
									'px-2.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-medium',
									activeCategory === cat.id
										? 'bg-primary text-white font-bold shadow-xs'
										: 'bg-base-200/80 hover:bg-base-300 text-muted'
								)}
							>
								{cat.label}
							</button>
						))}
					</div>
				</div>

				{filteredDefinitions.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center text-muted gap-2">
						<Icon name="search" size={24} className="opacity-40" />
						<span className="text-xs font-medium">
							ویجتی در این دسته وجود ندارد
						</span>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pb-4">
						{filteredDefinitions.map((def) => {
							const count = isCustom
								? runtimeLayout.filter((w) => w.id === def.id).length
								: visibility.includes(def.id as any)
									? 1
									: 0
							const isActive = count > 0
							const canAdd = isCustom
								? def.canDuplicate || !isActive
								: isAuthenticated ||
									isActive ||
									visibility.length < MAX_VISIBLE_WIDGETS

							return (
								<div
									key={def.id}
									onClick={() => handleAddWidget(def.id)}
									className={cn(
										'flex items-center justify-between p-3 rounded-2xl border transition-all duration-150 cursor-pointer group',
										isActive && !def.canDuplicate
											? 'bg-base-200/40 border-base-content/10'
											: 'bg-base-200/70 hover:bg-base-200 hover:border-primary/40 border-base-content/10 shadow-2xs hover:shadow-xs'
									)}
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<div className="w-10 h-10 rounded-xl bg-base-300/50 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
											{def.emoji}
										</div>
										<div className="flex flex-col min-w-0">
											<span className="text-xs font-bold text-content truncate group-hover:text-primary transition-colors">
												{def.label}
											</span>
											<span className="text-[10px] text-muted">
												اندازه {def.defaultSize.w}×
												{def.defaultSize.h}
											</span>
										</div>
									</div>

									<div className="flex items-center gap-1.5 shrink-0 mr-2">
										{isCustom && def.canDuplicate && isActive ? (
											<span className="text-[10px] px-2 py-0.5 rounded-lg bg-primary/15 text-primary font-medium">
												{count} فعال
											</span>
										) : isActive && !def.canDuplicate ? (
											<span className="text-[10px] px-2 py-0.5 rounded-lg bg-base-300 text-muted font-medium flex items-center gap-1">
												<Icon
													name="check"
													size={11}
													className="text-success"
												/>
												<span>اضافه‌شده</span>
											</span>
										) : null}

										{(!isActive || def.canDuplicate) && (
											<Button
												type="button"
												size="xs"
												rounded="xl"
												variant="primary"
												disabled={!canAdd}
												className="px-2.5 py-1 text-xs shrink-0 font-medium"
												onClick={(e) => {
													e.stopPropagation()
													handleAddWidget(def.id)
												}}
											>
												<span>+</span>
												<span>افزودن</span>
											</Button>
										)}
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>

			<WidgetHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
		</BottomSheet>
	)
}
