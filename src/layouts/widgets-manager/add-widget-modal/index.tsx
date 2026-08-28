import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { useOptionalFreeWidgets } from '@/context/free-widget.context'
import type {
	WidgetCategory,
	WidgetSize,
	WidgetVariantOption,
} from '@/layouts/widgets/layout-engine/types'
import { WIDGET_DEFINITIONS } from '@/layouts/widgets/widget-registry'
import { Icon } from '@/src/icons'
import type { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { WidgetHelpModal } from '../widget-help.modal'
import { useWidgetVipResolver } from '@/services/hooks/widgets/widget-catalog.hook'
import type { AddWidgetModalProps } from './types'
import { AddWidgetSidebar } from './sidebar'
import { AddWidgetOptions } from './options'
import { AddWidgetPreview } from './preview'
import { AddWidgetActions } from './actions'

export function AddWidgetModal({ isOpen, editTarget, onClose }: AddWidgetModalProps) {
	const { isVip } = useAuth()
	const { isWidgetVipOnly, isVariantVipOnly, isSizeVipOnly, maxFreeWidgets } =
		useWidgetVipResolver()
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
					const match =
						def.variants.find((v) => {
							if (currentWidget?.meta?.variant) {
								return v.meta?.variant === currentWidget.meta.variant
							}
							return (
								v.size.w === currentWidget?.size.w &&
								v.size.h === currentWidget?.size.h
							)
						}) || def.variants[0]
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
		if (!selectedDef) return

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
		const success = await addWidget(
			selectedDef.id,
			undefined,
			selectedSize,
			selectedVariant?.meta
		)
		if (success) {
			onClose()
		}
	}

	const filteredDefinitions = useMemo(() => {
		if (activeCategory === 'all') return allDefinitions
		return allDefinitions.filter((def) => def.category === activeCategory)
	}, [allDefinitions, activeCategory])

	if (!isOpen) {
		return null
	}

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
							variant="default"
							size="xs"
							rounded="xl"
							onClick={() => setIsHelpOpen(true)}
							className="flex items-center gap-1 text-xs text-muted hover:text-content px-2.5 py-1 border border-base-content/10 shadow-none font-normal"
							title="راهنمای مدیریت ویجت‌ها"
						>
							<Icon name="help" size={13} />
							<span>راهنما</span>
						</Button>
					</div>
				}
				size="xl"
				direction="rtl"
				closeOnBackdropClick
				className="max-w-4xl md:max-w-5xl"
			>
				<div className="flex flex-col md:flex-row gap-4 select-none w-full h-[calc(100dvh-11rem)] overflow-y-auto scrollbar-none md:h-[min(34.375rem,calc(100dvh-14rem))] md:overflow-visible">
					<AddWidgetSidebar
						activeCategory={activeCategory}
						onSelectCategory={handleCategoryChange}
						definitions={filteredDefinitions}
						selectedId={selectedId}
						onSelectWidget={handleSelectWidget}
						runtimeLayout={runtimeLayout}
						isVip={isVip}
						isWidgetVipOnly={isWidgetVipOnly}
						onOpenWidgetSettings={handleOpenWidgetSettings}
					/>

					<div className="flex flex-col w-full pr-0 md:min-h-0 md:w-7/12 md:pr-1">
						{selectedDef ? (
							<div className="flex flex-col gap-3 md:flex-1 md:min-h-0">
								<div className="flex flex-col gap-3 pr-0.5 scrollbar-none md:flex-1 md:min-h-0 md:overflow-y-auto">
									<div className="flex items-center justify-between pb-2 border-b border-base-content/10">
										<div className="flex items-center gap-2">
											<span className="text-2xl">
												{selectedDef.emoji}
											</span>
											<div>
												<h3 className="text-sm font-bold text-content">
													{selectedDef.label}
												</h3>
												<p className="text-[11px] text-muted">
													{selectedDef.canDuplicate
														? 'امکان افزودن چندین نمونه از این ویجت وجود دارد'
														: 'ویجت تکی صفحه اصلی'}
												</p>
											</div>
										</div>

										{selectedDef.settingsTab && (
											<Button
												variant="default"
												size="xs"
												rounded="xl"
												onClick={handleOpenSelectedSettings}
												className="flex items-center gap-1.5 text-xs text-muted hover:text-primary px-3 py-1.5"
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

								<div className="pt-2 border-t border-base-content/10 shrink-0">
									<AddWidgetActions
										isVipRequired={isVipRequired}
										isVip={isVip}
										isEditMode={isEditMode}
										isLimitReached={isLimitReached}
										canAddCustom={canAddCustom}
										isCurrentlyActive={isCurrentlyActive}
										isDuplicateRestricted={isDuplicateRestricted}
										selectedSize={selectedSize}
										onSave={handleSave}
										onRemove={handleRemove}
									/>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</Modal>

			<WidgetHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
		</>
	)
}

export type { AddWidgetModalProps } from './types'
