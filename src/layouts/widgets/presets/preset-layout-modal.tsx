import type React from 'react'
import { useMemo, useState } from 'react'
import { Button, ConfirmationModal, Modal } from '@/components/ui'
import { Icon } from '@/src/icons'
import { cn } from '@/common/utils/cn'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { useFreeWidgets } from '@/context/free-widget/free-widget.context'
import { WIDGET_DEFINITIONS } from '../widget-registry'
import { PRESET_LAYOUTS } from './preset-layouts.data'
import { PresetCanvasPreview } from './components/preset-canvas-preview'
import { resolvePresetWidgetsForViewport } from './utils'
import type { PresetLayout } from './types'

interface PresetLayoutModalProps {
	isOpen: boolean
	onClose: () => void
}

type FilterType = 'all' | 'free' | 'vip'

export const PresetLayoutModal: React.FC<PresetLayoutModalProps> = ({
	isOpen,
	onClose,
}) => {
	const { isVip } = useAuth()
	const { applyPresetLayout } = useFreeWidgets()

	const [activeFilter, setActiveFilter] = useState<FilterType>('all')
	const [selectedPresetToApply, setSelectedPresetToApply] =
		useState<PresetLayout | null>(null)
	const [isApplying, setIsApplying] = useState(false)

	const filteredPresets = useMemo(() => {
		switch (activeFilter) {
			case 'free':
				return PRESET_LAYOUTS.filter((p) => !p.isVip)
			case 'vip':
				return PRESET_LAYOUTS.filter((p) => p.isVip)
			default:
				return PRESET_LAYOUTS
		}
	}, [activeFilter])

	const handleRequestApply = (preset: PresetLayout) => {
		if (preset.isVip && !isVip) {
			callEvent('openSettings', 'vip')
			onClose()
			return
		}

		setSelectedPresetToApply(preset)
	}

	const handleConfirmApply = async () => {
		if (!selectedPresetToApply || isApplying) return

		setIsApplying(true)
		try {
			const preset = selectedPresetToApply
			const resolvedWidgets = resolvePresetWidgetsForViewport(preset)
			await applyPresetLayout(resolvedWidgets)
			setSelectedPresetToApply(null)
			onClose()
		} finally {
			setIsApplying(false)
		}
	}

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="lg"
				className="w-[calc(100vw-2rem)] max-w-2xl h-[580px] flex flex-col"
				direction="rtl"
				showCloseButton={true}
				title="چیدمان‌های آماده"
			>
				<div className="flex flex-col flex-1 min-h-0 gap-3 text-right">
					<div className="sticky top-0 z-10 flex items-center gap-1.5 shrink-0 overflow-x-auto pb-2 pt-0.5 no-scrollbar">
						<button
							type="button"
							onClick={() => setActiveFilter('all')}
							className={cn(
								'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
								activeFilter === 'all'
									? 'bg-primary text-white shadow-xs'
									: 'bg-base-200 hover:bg-base-300 text-muted'
							)}
						>
							<span>همه چیدمان‌ها</span>
						</button>

						<button
							type="button"
							onClick={() => setActiveFilter('free')}
							className={cn(
								'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
								activeFilter === 'free'
									? 'bg-primary text-white shadow-xs'
									: 'bg-base-200 hover:bg-base-300 text-muted'
							)}
						>
							<span>رایگان</span>
						</button>

						<button
							type="button"
							onClick={() => setActiveFilter('vip')}
							className={cn(
								'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1',
								activeFilter === 'vip'
									? 'bg-primary text-white shadow-xs'
									: 'bg-base-200 hover:bg-base-300 text-muted'
							)}
						>
							<Icon name="crown" size={13} className="text-indigo-500" />
							<span>ویژه پرو</span>
						</button>
					</div>

					<div className="grid flex-1 min-h-0 grid-cols-1 gap-3 p-1 overflow-y-auto sm:grid-cols-2">
						{filteredPresets.map((preset) => {
							const isVipRequired = preset.isVip && !isVip
							const uniqueWidgetIds = Array.from(
								new Set(preset.widgets.map((w) => w.id))
							)

							return (
								<div
									key={preset.id}
									className="flex flex-col justify-between gap-2.5 p-3 rounded-2xl bg-base-200/50 hover:bg-base-200 border border-base-content/10 transition-all text-right group"
								>
									<div className="flex flex-col gap-2">
										<PresetCanvasPreview
											preset={preset}
											isCompact={true}
											className="border-0 bg-base-300/40"
										/>

										<div className="flex flex-col gap-1.5">
											<div className="flex items-center justify-between gap-1">
												<span className="text-sm font-extrabold truncate text-content">
													{preset.title}
												</span>

												{preset.isVip ? (
													<span className="flex items-center gap-0.5 text-[10px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-full shrink-0">
														<Icon name="crown" size={11} />
														<span>پرو</span>
													</span>
												) : null}
											</div>

											<p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
												{preset.description}
											</p>

											<div className="flex flex-wrap items-center gap-1 pt-0.5">
												{uniqueWidgetIds.map((widgetId) => {
													const def =
														WIDGET_DEFINITIONS[
															widgetId as keyof typeof WIDGET_DEFINITIONS
														]
													if (!def) return null

													return (
														<span
															key={widgetId}
															className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-base-300/60 border border-base-content/5 text-[10px] font-medium text-muted"
														>
															<span className="text-[10px] leading-none">
																{def.emoji}
															</span>
															<span>{def.label}</span>
														</span>
													)
												})}
											</div>
										</div>
									</div>

									<div className="pt-0.5">
										{isVipRequired ? (
											<Button
												type="button"
												onClick={() => {
													callEvent('openSettings', 'vip')
													onClose()
												}}
												className="w-full flex items-center justify-center gap-1 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-500 border border-indigo-500/30 text-xs font-bold py-1.5"
												rounded="xl"
												variant="default"
											>
												<Icon name="crown" size={13} />
												<span>ارتقا به پرو</span>
											</Button>
										) : (
											<Button
												type="button"
												onClick={() => handleRequestApply(preset)}
												className="w-full text-xs font-bold py-1.5"
												rounded="xl"
												variant="primary"
											>
												<span>اعمال چیدمان</span>
											</Button>
										)}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</Modal>

			<ConfirmationModal
				isOpen={Boolean(selectedPresetToApply)}
				onClose={() => {
					if (!isApplying) setSelectedPresetToApply(null)
				}}
				onConfirm={handleConfirmApply}
				isLoading={isApplying}
				title="اعمال چیدمان جدید"
				message={
					selectedPresetToApply
						? `با اعمال چیدمان «${selectedPresetToApply.title}»، ویجت‌ها و چیدمان فعلی جایگزین می‌شن. مطمئنی؟`
						: 'می‌خوای این چیدمان رو اعمال کنی؟'
				}
				confirmText="آره، اعمال کن"
				cancelText="انصراف"
				variant="warning"
			/>
		</>
	)
}
