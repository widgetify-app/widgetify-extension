import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Modal } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { useOptionalFreeWidgets } from '@/features/widgets/widgets.context'
import type {
	WidgetCategory,
	WidgetSize,
	WidgetVariantOption,
} from '@/features/widgets/utils/layout-engine/types'
import { WIDGET_DEFINITIONS } from '@/features/widgets/registry'
import { Icon } from '@/icons'
import type { WidgetTabKeys } from '@/features/widgets/types'
import { WidgetHelpModal } from '../components/widget-help-modal'
import { useWidgetVipResolver } from '@/features/widgets/hooks/use-widget-vip-resolver'
import { CATEGORIES, type AddWidgetModalProps } from './types'
import { AddWidgetSidebar } from './components/sidebar'
import { AddWidgetOptions } from './components/options'
import { AddWidgetPreview } from './components/preview'
import { AddWidgetActions } from './components/actions'

export function AddWidgetModal({ isOpen, editTarget, onClose }: AddWidgetModalProps) {
	const { isVip } = useAuth()
	const {
		isWidgetVipOnly,
		isVariantVipOnly,
		isSizeVipOnly,
		isWidgetNew,
		featuredWidgetKeys,
		maxFreeWidgets,
	} = useWidgetVipResolver(isOpen)
	const freeWidgets = useOptionalFreeWidgets()

	const runtimeLayout = freeWidgets?.runtimeLayout || []
	const addWidget = freeWidgets?.addWidget
	const updateWidgetVariant = freeWidgets?.updateWidgetVariant
	const removeWidget = freeWidgets?.removeWidget

	const allDefinitions = useMemo(() => {
		return Object.values(WIDGET_DEFINITIONS)
	}, [])

	const [selectedId, setSelectedId] = useState<string>(allDefinitions[0]?.id || '')

	const selectedDef =
		WIDGET_DEFINITIONS[selectedId as keyof typeof WIDGET_DEFINITIONS] ||
		allDefinitions[0]

	const [selectedSize, setSelectedSize] = useState<WidgetSize>(
		selectedDef?.defaultSize || { w: 2, h: 2 }
	)
	const [selectedVariant, setSelectedVariant] = useState<WidgetVariantOption | null>(
		selectedDef?.variants?.[0] || null
	)
	const [activeCategory, setActiveCategory] = useState<WidgetCategory>('all')
	const [isHelpOpen, setIsHelpOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (!isOpen) {
			setIsLoading(false)
		}
	}, [isOpen])

	useEffect(() => {
		if (editTarget) {
			const def =
				WIDGET_DEFINITIONS[editTarget.widgetId as keyof typeof WIDGET_DEFINITIONS]
			if (def) {
				setSelectedId(def.id)
				const currentWidget = runtimeLayout.find(
					(w) => w.instanceId === editTarget.instanceId
				)
				if (def.variants && def.variants.length > 0) {
					const storedModel = currentWidget?.meta?.variant
					const isSameModel = (v: WidgetVariantOption) =>
						!storedModel || v.meta?.variant === storedModel
					const isSameSize = (v: WidgetVariantOption) =>
						v.size.w === currentWidget?.size.w &&
						v.size.h === currentWidget?.size.h
					const match =
						def.variants.find((v) => isSameModel(v) && isSameSize(v)) ||
						def.variants.find(isSameModel) ||
						def.variants[0]
					setSelectedVariant(match)
					setSelectedSize(match.size)
				} else {
					setSelectedVariant(null)
					setSelectedSize(currentWidget?.size || def.defaultSize)
				}
			}
		}
	}, [editTarget, runtimeLayout])

	const isEditMode = Boolean(editTarget)

	const handleCategoryChange = (categoryId: WidgetCategory) => {
		setActiveCategory(categoryId)
		if (!isEditMode) {
			const nextList =
				categoryId === 'new'
					? allDefinitions.filter((def) => isWidgetNew(def.id))
					: categoryId === 'all'
						? allDefinitions
						: allDefinitions.filter((def) => def.category === categoryId)

			if (nextList.length > 0 && !nextList.some((def) => def.id === selectedId)) {
				handleSelectWidget(nextList[0].id)
			}
		}
	}

	const handleSelectWidget = (id: string) => {
		if (isEditMode) return
		setSelectedId(id)
		const def = WIDGET_DEFINITIONS[id as keyof typeof WIDGET_DEFINITIONS]
		if (def) {
			if (def.variants && def.variants.length > 0) {
				setSelectedVariant(def.variants[0])
				setSelectedSize(def.variants[0].size)
			} else {
				setSelectedVariant(null)
				setSelectedSize(def.defaultSize)
			}
		}
	}

	const handleOpenWidgetSettings = (
		e: React.MouseEvent,
		settingsTab?: WidgetTabKeys
	) => {
		e.stopPropagation()
		if (settingsTab) {
			callEvent('openWidgetsSettings', { tab: settingsTab })
		}
	}

	const handleOpenSelectedSettings = () => {
		if (selectedDef?.settingsTab) {
			callEvent('openWidgetsSettings', { tab: selectedDef.settingsTab })
		}
	}

	const handleVariantChange = (variant: WidgetVariantOption) => {
		setSelectedVariant(variant)
		setSelectedSize(variant.size)
	}

	const handleSizeChange = (sizeOption: WidgetSize) => {
		setSelectedVariant(null)
		setSelectedSize(sizeOption)
	}

	const activeCount = runtimeLayout.filter((w) => w.id === selectedDef?.id).length

	const isCurrentlyActive = activeCount > 0
	const isDuplicateRestricted =
		Boolean(selectedDef?.canDuplicate) && isCurrentlyActive && !isVip

	const canAddCustom = isVip
		? Boolean(selectedDef?.canDuplicate || !isCurrentlyActive)
		: !isCurrentlyActive

	const isCurrentWidgetVipOnly = isWidgetVipOnly(selectedDef?.id)
	const isCurrentVariantVipOnly = isVariantVipOnly(selectedDef?.id, selectedVariant?.id)
	const isCurrentSizeVipOnly =
		!selectedVariant && isSizeVipOnly(selectedDef?.id, selectedSize)
	const isVipRequired =
		isCurrentWidgetVipOnly || isCurrentVariantVipOnly || isCurrentSizeVipOnly

	const isLimitReached = !isVip && runtimeLayout.length >= maxFreeWidgets

	const handleRemove = () => {
		if (!selectedDef || !removeWidget) return
		const target = runtimeLayout.find((w) => w.id === selectedDef.id)
		if (!target) return
		removeWidget(target.instanceId)
	}

	const handleSave = async () => {
		if (!selectedDef || isLoading) return

		if (isVipRequired && !isVip) {
			callEvent('openSettings', 'vip')
			return
		}

		if (isEditMode && editTarget && updateWidgetVariant) {
			const success = updateWidgetVariant(
				editTarget.instanceId,
				selectedSize,
				selectedVariant?.meta
			)
			if (success) {
				onClose()
			}
			return
		}

		if (isLimitReached) {
			callEvent('openSettings', 'vip')
			return
		}

		if (!canAddCustom || !addWidget) return

		setIsLoading(true)
		try {
			const success = await addWidget(
				selectedDef.id,
				undefined,
				selectedSize,
				selectedVariant?.meta
			)
			if (success) {
				onClose()
			}
		} finally {
			setIsLoading(false)
		}
	}

	const hasNewWidgets = useMemo(() => {
		return allDefinitions.some((def) => isWidgetNew(def.id))
	}, [allDefinitions, isWidgetNew])

	const categories = useMemo(() => {
		if (!hasNewWidgets) return CATEGORIES
		return [
			CATEGORIES[0],
			{ id: 'new' as WidgetCategory, label: 'جدید' },
			...CATEGORIES.slice(1),
		]
	}, [hasNewWidgets])

	const filteredDefinitions = useMemo(() => {
		let list = allDefinitions
		if (activeCategory === 'new') {
			list = allDefinitions.filter((def) => isWidgetNew(def.id))
		} else if (activeCategory !== 'all') {
			list = allDefinitions.filter((def) => def.category === activeCategory)
		}

		if (
			activeCategory === 'all' &&
			featuredWidgetKeys &&
			featuredWidgetKeys.length > 0
		) {
			const featuredIndexMap = new Map(
				featuredWidgetKeys.map((key, idx) => [key, idx])
			)
			return [...list].sort((a, b) => {
				const aIndex = featuredIndexMap.get(a.id)
				const bIndex = featuredIndexMap.get(b.id)
				if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex
				if (aIndex !== undefined) return -1
				if (bIndex !== undefined) return 1
				return 0
			})
		}

		return list
	}, [allDefinitions, activeCategory, isWidgetNew, featuredWidgetKeys])

	const previewSize = selectedSize

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title={
					<div className="flex items-center gap-2.5">
						<span>
							{editTarget
								? 'تغییر مدل و استایل ویجت'
								: 'مدیریت و افزودن ویجت‌ها'}
						</span>
						<Button
							type="button"
							size="xs"
							rounded="xl"
							onClick={() => setIsHelpOpen(true)}
							variant="ghost"
							className="gap-1 text-xs px-2.5 py-1 border-line font-normal"
						>
							<Icon name="help" size={12} />
							<span>راهنما</span>
						</Button>
					</div>
				}
				size="xl"
				closeOnBackdropClick
				className="max-w-4xl md:max-w-5xl"
			>
				<div className="flex flex-col md:flex-row gap-4 select-none w-full h-[calc(100dvh-11rem)] overflow-y-auto scrollbar-none md:h-[min(34.375rem,calc(100dvh-14rem))] md:overflow-visible">
					<AddWidgetSidebar
						activeCategory={activeCategory}
						onSelectCategory={handleCategoryChange}
						categories={categories}
						definitions={filteredDefinitions}
						selectedId={selectedId}
						onSelectWidget={handleSelectWidget}
						runtimeLayout={runtimeLayout}
						isVip={isVip}
						isWidgetVipOnly={isWidgetVipOnly}
						isWidgetNew={isWidgetNew}
						onOpenWidgetSettings={handleOpenWidgetSettings}
					/>

					<div className="flex flex-col w-full pr-0 md:min-h-0 md:w-7/12 md:pr-1">
						{selectedDef ? (
							<div className="flex flex-col gap-3 md:flex-1 md:min-h-0">
								<div className="flex flex-col gap-3 pr-0.5 scrollbar-none md:flex-1 md:min-h-0 md:overflow-y-auto">
									<div className="flex items-center justify-between pb-2 border-b border-line">
										<div className="flex items-center gap-2">
											<span className="flex items-center justify-center rounded-xl w-9 h-9 shrink-0 bg-brand-fill text-brand">
												<Icon name={selectedDef.icon} size={20} />
											</span>
											<div>
												<div className="flex items-center gap-1.5">
													<h3 className="text-sm font-bold text-fg">
														{selectedDef.label}
													</h3>
													{isWidgetNew?.(selectedDef.id) && (
														<Badge>جدید</Badge>
													)}
												</div>
												<p className="text-2xs text-fg-muted">
													{selectedDef.canDuplicate
														? 'امکان افزودن چندین نمونه از این ویجت وجود دارد'
														: 'ویجت تکی صفحه اصلی'}
												</p>
											</div>
										</div>

										{selectedDef.settingsTab && (
											<Button
												size="xs"
												rounded="xl"
												onClick={handleOpenSelectedSettings}
												variant="outline"
												className="gap-1.5 text-xs px-3 py-1.5 hover:text-brand"
											>
												<Icon name="settings" size={12} />
												<span>تنظیمات ویجت</span>
											</Button>
										)}
									</div>

									<AddWidgetOptions
										definition={selectedDef}
										selectedSize={selectedSize}
										selectedVariant={selectedVariant}
										isVip={isVip}
										onSelectSize={handleSizeChange}
										onSelectVariant={handleVariantChange}
										isVariantVipOnly={isVariantVipOnly}
										isSizeVipOnly={isSizeVipOnly}
									/>

									<AddWidgetPreview
										definition={selectedDef}
										previewSize={previewSize}
										selectedVariant={selectedVariant}
									/>
								</div>

								<div className="pt-2 border-t border-line shrink-0">
									<AddWidgetActions
										isVipRequired={isVipRequired}
										isVip={isVip}
										isEditMode={isEditMode}
										isLimitReached={isLimitReached}
										canAddCustom={canAddCustom}
										isCurrentlyActive={isCurrentlyActive}
										isDuplicateRestricted={isDuplicateRestricted}
										selectedSize={selectedSize}
										isLoading={isLoading}
										onSave={handleSave}
										onRemove={handleRemove}
									/>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</Modal>

			{isHelpOpen && (
				<WidgetHelpModal
					isOpen={isHelpOpen}
					onClose={() => setIsHelpOpen(false)}
				/>
			)}
		</>
	)
}

export type { AddWidgetModalProps } from './types'
