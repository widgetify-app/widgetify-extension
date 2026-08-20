import { useMemo, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { useFreeWidgets } from '@/context/free-widget.context'
import type { WidgetCategory, WidgetSize } from '../layout-engine/types'
import { WIDGET_DEFINITIONS } from '../widget-registry'
import { toPersianDigits } from '@/common/utils/persian-digits'

interface AddWidgetModalProps {
	isOpen: boolean
	onClose: () => void
}

export function AddWidgetModal({ isOpen, onClose }: AddWidgetModalProps) {
	const { runtimeLayout, addWidget } = useFreeWidgets()

	const allDefinitions = Object.values(WIDGET_DEFINITIONS)
	const [selectedId, setSelectedId] = useState<string>(allDefinitions[0]?.id || '')

	const selectedDef =
		WIDGET_DEFINITIONS[selectedId as keyof typeof WIDGET_DEFINITIONS] ||
		allDefinitions[0]

	const [selectedSize, setSelectedSize] = useState<WidgetSize>(
		selectedDef?.defaultSize || { w: 2, h: 2 }
	)

	const handleSelectWidget = (id: string) => {
		setSelectedId(id)
		const def = WIDGET_DEFINITIONS[id as keyof typeof WIDGET_DEFINITIONS]
		if (def) {
			setSelectedSize(def.defaultSize)
		}
	}

	const activeCount = runtimeLayout.filter((w) => w.id === selectedDef?.id).length
	const isCurrentlyActive = activeCount > 0
	const canAdd = selectedDef?.canDuplicate || !isCurrentlyActive

	const handleAdd = async () => {
		if (!selectedDef || !canAdd) return
		const success = await addWidget(selectedDef.id, undefined, selectedSize)
		if (success) {
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

	const [activeCategory, setActiveCategory] = useState<WidgetCategory>('all')

	const categories: { id: WidgetCategory; label: string }[] = [
		{ id: 'all', label: 'همه' },
		{ id: 'time', label: 'زمان و تاریخ' },
		{ id: 'productivity', label: 'ابزار و تسک' },
		{ id: 'info', label: 'اطلاعات و رسانه' },
		{ id: 'lifestyle', label: 'سرگرمی' },
	]

	const filteredDefinitions = useMemo(() => {
		if (activeCategory === 'all') return allDefinitions
		return allDefinitions.filter((def) => def.category === activeCategory)
	}, [allDefinitions, activeCategory])

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="افزودن ویجت به صفحه"
			size="xl"
			direction="rtl"
			closeOnBackdropClick={true}
			className="max-w-4xl md:max-w-5xl"
		>
			<div className="flex flex-col md:flex-row gap-4 h-[550px] select-none">
				{/* Right: Widget List (Sidebar) */}
				<div className="w-full md:w-5/12 flex flex-col border-b md:border-b-0 md:border-l border-base-content/10 pl-0 md:pl-3 pb-3 md:pb-0">
					{/* Category Tabs */}
					<div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-2 mb-2 border-b border-base-content/10">
						{categories.map((cat) => (
							<button
								key={cat.id}
								type="button"
								onClick={() => setActiveCategory(cat.id)}
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
							const count = runtimeLayout.filter(
								(w) => w.id === def.id
							).length
							const isActive = count > 0

							return (
								<button
									key={def.id}
									type="button"
									onClick={() => handleSelectWidget(def.id)}
									className={`w-full flex items-center justify-between p-2.5 rounded-2xl border text-right transition-all duration-150 cursor-pointer ${
										isSelected
											? 'bg-primary/10 border-primary shadow-xs'
											: 'bg-base-200/60 hover:bg-base-200 border-base-content/10'
									}`}
								>
									<div className="flex items-center gap-2 min-w-0">
										<span className="text-xl flex-shrink-0">
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

									<div className="flex items-center gap-1.5 flex-shrink-0 mr-2">
										{def.canDuplicate ? (
											<span
												className={`text-[10px] px-1.5 py-0.5 rounded-lg font-medium ${
													isActive
														? 'bg-primary/15 text-primary'
														: 'bg-base-300 text-muted'
												}`}
											>
												{isActive
													? `${toPersianDigits(count)} فعال`
													: 'قابل تکرار'}
											</span>
										) : isActive ? (
											<span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-base-300 text-muted font-medium">
												فعال
											</span>
										) : null}
									</div>
								</button>
							)
						})}
					</div>
				</div>

				{/* Left: Preview & Configuration Panel */}
				<div className="w-full md:w-7/12 flex flex-col justify-between pr-0 md:pr-1">
					{selectedDef ? (
						<div className="flex flex-col flex-1 justify-between gap-3">
							{/* Header Info */}
							<div className="flex items-center justify-between pb-2 border-b border-base-content/10">
								<div className="flex items-center gap-2">
									<span className="text-2xl">{selectedDef.emoji}</span>
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
							</div>

							{/* Size Selection Bar */}
							<div className="flex flex-col gap-1.5">
								<span className="text-xs font-bold text-content">
									انتخاب اندازه ویجت:
								</span>
								<div className="flex flex-wrap gap-1.5">
									{selectedDef.allowedSizes.map((sizeOption) => {
										const isCurrentSize =
											selectedSize.w === sizeOption.w &&
											selectedSize.h === sizeOption.h
										const isDefault =
											selectedDef.defaultSize.w === sizeOption.w &&
											selectedDef.defaultSize.h === sizeOption.h

										return (
											<button
												key={`${sizeOption.w}x${sizeOption.h}`}
												type="button"
												onClick={() =>
													setSelectedSize(sizeOption)
												}
												className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
													isCurrentSize
														? 'bg-primary text-white font-bold shadow-xs'
														: 'bg-base-200/80 hover:bg-base-300 text-content border border-base-content/10 font-medium'
												}`}
											>
												<span>
													{toPersianDigits(sizeOption.w)} ×{' '}
													{toPersianDigits(sizeOption.h)}
												</span>
												{isDefault && !isCurrentSize && (
													<span className="text-[9px] text-muted mr-1">
														(پیش‌فرض)
													</span>
												)}
											</button>
										)
									})}
								</div>
							</div>

							{/* Dynamic Preview Container */}
							<div
								style={{
									backgroundImage:
										'radial-gradient(circle, currentColor 1px, transparent 1px)',
									backgroundSize: '16px 16px',
								}}
								className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-base-300/10 text-base-content/15 border border-base-content/10 overflow-hidden relative min-h-47.5"
							>
								<div className="text-[10px] text-muted absolute top-2 right-2 font-medium bg-base-200/80 px-2 py-0.5 rounded-lg border border-base-content/10 z-10">
									پیش‌نمایش در اندازه {toPersianDigits(selectedSize.w)}×
									{toPersianDigits(selectedSize.h)}
								</div>

								<div
									style={getPreviewDimensions(selectedSize)}
									className="flex items-center justify-center overflow-hidden pointer-events-none select-none transition-all duration-200"
								>
									<div className="w-full h-full flex items-center justify-center">
										{selectedDef.node('preview-sample', selectedSize)}
									</div>
								</div>
							</div>

							<div className="pt-2 border-t border-base-content/10">
								{canAdd ? (
									<Button
										type="button"
										onClick={handleAdd}
										className="w-full"
										rounded={'2xl'}
										variant={'primary'}
									>
										<span>+</span>
										<span>
											افزودن ویجت با اندازه{' '}
											{toPersianDigits(selectedSize.w)}×
											{toPersianDigits(selectedSize.h)}
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
								)}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</Modal>
	)
}
