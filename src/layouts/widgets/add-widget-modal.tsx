import React, { useEffect, useMemo, useState } from 'react'
import { Button, Chip, Modal } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { UI, useAppearanceSetting } from '@/context/appearance.context'
import {
	MAX_VISIBLE_WIDGETS,
	useWidgetVisibility,
} from '@/context/widget-visibility.context'
import { useOptionalFreeWidgets } from '@/context/free-widget.context'
import type {
	WidgetCategory,
	WidgetSize,
	WidgetVariantOption,
} from '@/layouts/widgets/layout-engine/types'
import { WIDGET_DEFINITIONS } from '@/layouts/widgets/widget-registry'
import { Icon } from '@/src/icons'
import type { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'

interface AddWidgetModalProps {
	isOpen: boolean
	editTarget?: {
		instanceId: string
		widgetId: string
	} | null
	onClose: () => void
}

const CATEGORIES: { id: WidgetCategory; label: string }[] = [
	{ id: 'all', label: 'همه' },
	{ id: 'time', label: 'زمان و تاریخ' },
	{ id: 'productivity', label: 'ابزار و تسک' },
	{ id: 'info', label: 'اطلاعات و رسانه' },
	{ id: 'lifestyle', label: 'سرگرمی' },
]

export function AddWidgetModal({ isOpen, editTarget, onClose }: AddWidgetModalProps) {
	const { isAuthenticated } = useAuth()
	const { ui } = useAppearanceSetting()
	const { visibility, toggleWidget } = useWidgetVisibility()
	const freeWidgets = useOptionalFreeWidgets()

	const runtimeLayout = freeWidgets?.runtimeLayout || []
	const addWidget = freeWidgets?.addWidget
	const updateWidgetVariant = freeWidgets?.updateWidgetVariant

	const isCustom = ui === UI.CUSTOM
	const currentMode = isCustom ? 'CUSTOM' : 'ADVANCED'

	const allDefinitions = useMemo(() => {
		return Object.values(WIDGET_DEFINITIONS).filter(
			(def) => !def.supportedModes || def.supportedModes.includes(currentMode)
		)
	}, [currentMode])

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

	const activeCount = isCustom
		? runtimeLayout.filter((w) => w.id === selectedDef?.id).length
		: visibility.includes(selectedDef?.id as any)
			? 1
			: 0

	const isCurrentlyActive = activeCount > 0
	const canAddCustom = selectedDef?.canDuplicate || !isCurrentlyActive

	const handleSave = async () => {
		if (!selectedDef) return

		if (isCustom) {
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
		} else {
			toggleWidget(selectedDef.id as any)
			onClose()
		}
	}

	const getPreviewDimensions = (size: WidgetSize) => {
		const cellW = 125
		const cellH = 96
		const gap = 8

		const width = size.w * cellW + (size.w - 1) * gap
		const height = size.h * cellH + (size.h - 1) * gap

		const maxPreviewW = 540
		const maxPreviewH = 260
		const scale = Math.min(1, maxPreviewW / width, maxPreviewH / height)

		return {
			width: `${width}px`,
			height: `${height}px`,
			transform: scale < 1 ? `scale(${scale})` : undefined,
			transformOrigin: 'center center',
		}
	}

	const filteredDefinitions = useMemo(() => {
		if (activeCategory === 'all') return allDefinitions
		return allDefinitions.filter((def) => def.category === activeCategory)
	}, [allDefinitions, activeCategory])

	if (ui === UI.SIMPLE || !isOpen) {
		return null
	}

	const previewSize = isCustom
		? selectedSize
		: selectedDef?.defaultSize || { w: 2, h: 3 }
	const canToggleAdvanced =
		isAuthenticated || isCurrentlyActive || visibility.length < MAX_VISIBLE_WIDGETS

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={editTarget ? 'تغییر مدل و استایل ویجت' : 'مدیریت و افزودن ویجت‌ها'}
			size="xl"
			direction="rtl"
			closeOnBackdropClick
			className="max-w-4xl md:max-w-5xl"
		>
			<div className="flex flex-col md:flex-row gap-4 h-137.5 select-none w-full">
				<div className="w-full md:w-5/12 flex flex-col border-b md:border-b-0 md:border-l border-base-content/10 pl-0 md:pl-3 pb-3 md:pb-0">
					<div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-2 mb-2 border-b border-base-content/10">
						{CATEGORIES.map((cat) => (
							<button
								key={cat.id}
								type="button"
								onClick={() => handleCategoryChange(cat.id)}
								className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
									activeCategory === cat.id
										? 'bg-primary text-white font-bold shadow-xs'
										: 'bg-base-200/60 hover:bg-base-200 text-muted font-medium'
								}`}
							>
								{cat.label}
							</button>
						))}
					</div>

					<div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-none">
						{filteredDefinitions.map((def) => {
							const isSelected = def.id === selectedId
							const count = isCustom
								? runtimeLayout.filter((w) => w.id === def.id).length
								: visibility.includes(def.id as any)
									? 1
									: 0
							const isActive = count > 0

							return (
								<div
									key={def.id}
									onClick={() => handleSelectWidget(def.id)}
									className={`w-full flex items-center justify-between p-2.5 rounded-2xl border text-right transition-all duration-150 cursor-pointer ${
										isSelected
											? 'bg-primary/10 border-primary shadow-xs'
											: 'bg-base-200/60 hover:bg-base-200 border-base-content/10'
									}`}
								>
									<div className="flex items-center gap-2 min-w-0">
										<span className="text-xl shrink-0">
											{def.emoji}
										</span>
										<span
											className={`text-xs truncate ${
												isSelected
													? 'font-bold text-primary'
													: 'font-medium text-content'
											}`}
										>
											{def.label}
										</span>
									</div>

									<div className="flex items-center gap-1.5 shrink-0 mr-2">
										{def.settingsTab && (
											<Button
												type="button"
												onClick={(e) =>
													handleOpenWidgetSettings(
														e,
														def.settingsTab
													)
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
										{isCustom && def.canDuplicate ? (
											<span
												className={`text-[10px] px-1.5 py-0.5 rounded-lg font-medium ${
													isActive
														? 'bg-primary/15 text-primary'
														: 'bg-base-300 text-muted'
												}`}
											>
												{isActive
													? `${count} فعال`
													: 'قابل تکرار'}
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

				<div className="w-full md:w-7/12 flex flex-col justify-between pr-0 md:pr-1">
					{selectedDef ? (
						<div className="flex flex-col flex-1 justify-between gap-3">
							<div className="flex items-center justify-between pb-2 border-b border-base-content/10">
								<div className="flex items-center gap-2">
									<span className="text-2xl">{selectedDef.emoji}</span>
									<div>
										<h3 className="text-sm font-bold text-content">
											{selectedDef.label}
										</h3>
										<p className="text-[11px] text-muted">
											{isCustom
												? selectedDef.canDuplicate
													? 'امکان افزودن چندین نمونه از این ویجت وجود دارد'
													: 'ویجت تکی صفحه اصلی'
												: 'ویجت در چیدمان استاندارد صفحه'}
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

							{isCustom &&
								(selectedDef.variants &&
								selectedDef.variants.length > 0 ? (
									<div className="flex flex-col gap-1.5">
										<span className="text-xs font-bold text-content">
											انتخاب مدل و استایل:
										</span>
										<div className="flex flex-wrap gap-1.5">
											{selectedDef.variants.map((variant) => {
												const isCurrent =
													selectedVariant?.id === variant.id ||
													(!selectedVariant &&
														selectedSize.w ===
															variant.size.w &&
														selectedSize.h === variant.size.h)

												return (
													<button
														key={variant.id}
														type="button"
														onClick={() =>
															handleVariantChange(variant)
														}
														className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
															isCurrent
																? 'bg-primary text-white font-bold shadow-xs'
																: 'bg-base-200/80 hover:bg-base-300 text-content border border-base-content/10 font-medium'
														}`}
													>
														<span>{variant.label}</span>
													</button>
												)
											})}
										</div>
									</div>
								) : (
									<div className="flex flex-col gap-1.5">
										<span className="text-xs font-bold text-content">
											انتخاب اندازه ویجت:
										</span>
										<div className="flex flex-wrap gap-1.5">
											{selectedDef.allowedSizes.map(
												(sizeOption) => {
													const isCurrentSize =
														selectedSize.w === sizeOption.w &&
														selectedSize.h === sizeOption.h
													const isDefault =
														selectedDef.defaultSize.w ===
															sizeOption.w &&
														selectedDef.defaultSize.h ===
															sizeOption.h

													return (
														<Chip
															onClick={() =>
																handleSizeChange(
																	sizeOption
																)
															}
															key={`${sizeOption.w}x${sizeOption.h}`}
															className="py-1"
															selected={isCurrentSize}
														>
															<span>
																{sizeOption.w} ×{' '}
																{sizeOption.h}
															</span>
															{isDefault &&
																!isCurrentSize && (
																	<span className="text-[9px] text-muted mr-1">
																		(پیش‌فرض)
																	</span>
																)}
														</Chip>
													)
												}
											)}
										</div>
									</div>
								))}

							<div
								style={{
									backgroundImage:
										'radial-gradient(circle, currentColor 1px, transparent 1px)',
									backgroundSize: '16px 16px',
								}}
								className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-base-300/10 text-base-content/15 border border-base-content/10 overflow-hidden relative min-h-47.5"
							>
								<div className="text-[10px] text-muted absolute top-2 right-2 font-medium bg-base-200/80 px-2 py-0.5 rounded-lg border border-base-content/10 z-10">
									پیش‌نمایش در اندازه {previewSize.w}×{previewSize.h}
								</div>

								<div
									style={getPreviewDimensions(previewSize)}
									className="flex items-center justify-center overflow-hidden pointer-events-none select-none transition-all duration-200"
								>
									<div className="w-full h-full flex items-center justify-center">
										{selectedDef.node(
											'preview-sample',
											previewSize,
											selectedVariant?.meta
										)}
									</div>
								</div>
							</div>

							<div className="pt-2 border-t border-base-content/10">
								{isCustom ? (
									isEditMode ? (
										<Button
											type="button"
											onClick={handleSave}
											className="w-full"
											rounded={'2xl'}
											variant={'primary'}
										>
											<span>ذخیره تغییرات</span>
										</Button>
									) : canAddCustom ? (
										<Button
											type="button"
											onClick={handleSave}
											className="w-full"
											rounded={'2xl'}
											variant={'primary'}
										>
											<span>+</span>
											<span>
												افزودن ویجت با اندازه {selectedSize.w}×
												{selectedSize.h}
											</span>
										</Button>
									) : (
										<Button
											disabled
											variant={'default'}
											rounded={'2xl'}
											className="w-full"
										>
											این ویجت قبلا به صفحه اضافه شده!
										</Button>
									)
								) : isCurrentlyActive ? (
									<Button
										type="button"
										onClick={handleSave}
										className="w-full text-error hover:bg-error/10 border-error/20"
										rounded={'2xl'}
										variant={'default'}
									>
										<span>حذف از صفحه</span>
									</Button>
								) : canToggleAdvanced ? (
									<Button
										type="button"
										onClick={handleSave}
										className="w-full"
										rounded={'2xl'}
										variant={'primary'}
									>
										<span>+</span>
										<span>افزودن به صفحه</span>
									</Button>
								) : (
									<Button
										disabled
										variant={'default'}
										rounded={'2xl'}
										className="w-full"
									>
										حداکثر ویجت‌های مجاز فعال شده‌اند (مهمان)
									</Button>
								)}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</Modal>
	)
}
