import type React from 'react'
import { memo, useMemo, useState } from 'react'
import { Button, ConfirmationModal, Modal } from '@/components/ui'
import { Icon } from '@/icons'
import { cn } from '@/common/utils/cn'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { useFreeWidgetActions } from '@/context/free-widget/free-widget.context'
import { WIDGET_DEFINITIONS } from '../../widget-registry'
import { PRESET_LAYOUTS } from '../preset-layouts'
import { PresetCanvasPreview } from './preset-canvas-preview'
import { resolvePresetWidgetsForViewport } from '../utils/viewport'
import type { PresetLayout } from '../types'

interface PresetLayoutModalProps {
	isOpen: boolean
	onClose: () => void
}

type FilterType = 'all' | 'free' | 'vip'

const PresetLayoutModalComponent: React.FC<PresetLayoutModalProps> = ({
	isOpen,
	onClose,
}) => {
	const { isVip } = useAuth()
	const { applyPresetLayout } = useFreeWidgetActions()

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
				className="w-[calc(100vw-2rem)] max-w-2xl h-145 flex flex-col"
				direction="rtl"
				showCloseButton={true}
				title="چیدمان‌های آماده"
			>
				<div className="flex flex-col flex-1 min-h-0 gap-3 text-right">
					<div className="sticky top-0 z-10 flex items-center gap-1.5 shrink-0 overflow-x-auto pb-2 pt-0.5 scrollbar-none">
						<button
							type="button"
							onClick={() => setActiveFilter('all')}
							className={cn(
								'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
								activeFilter === 'all'
									? 'bg-primary text-primary-content shadow-xs'
									: 'bg-content hover:bg-raised text-muted'
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
									? 'bg-primary text-primary-content shadow-xs'
									: 'bg-content hover:bg-raised text-muted'
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
									? 'bg-primary text-primary-content shadow-xs'
									: 'bg-content hover:bg-raised text-muted'
							)}
						>
							<Icon name="diamond" size={13} className="text-vip" />
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
									className="flex flex-col justify-between gap-2.5 p-3 rounded-2xl bg-subtle hover:bg-content border border-subtle transition-all text-right group"
								>
									<div className="flex flex-col gap-2">
										<PresetCanvasPreview
											preset={preset}
											isCompact={true}
											className="border-0 bg-muted"
										/>

										<div className="flex flex-col gap-1.5">
											<div className="flex items-center justify-between gap-1">
												<span className="text-sm font-extrabold truncate text-content">
													{preset.title}
												</span>

												{preset.isVip ? (
													<span className="flex items-center gap-0.5 text-[10px] font-bold text-vip bg-vip/10 border border-vip/20 px-1.5 py-0.5 rounded-full shrink-0">
														<Icon name="diamond" size={11} />
														<span>پرو</span>
													</span>
												) : null}
											</div>

											<p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
												{preset.description}
											</p>

											<div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
												{uniqueWidgetIds.map((widgetId) => {
													const def =
														WIDGET_DEFINITIONS[
															widgetId as keyof typeof WIDGET_DEFINITIONS
														]
													if (!def) return null

													return (
														<span
															key={widgetId}
															className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted border border-faint shrink-0 text-[10px] font-medium text-muted hover:text-content transition-colors"
														>
															<span className="text-xs leading-none">
																{def.emoji}
															</span>
															<span className="truncate max-w-20">
																{def.label}
															</span>
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
												className="w-full gap-1 text-xs font-bold py-1.5"
												rounded="xl"
												variant="outline"
												color="vip"
											>
												<Icon name="diamond" size={13} />
												<span>ارتقا به پرو</span>
											</Button>
										) : (
											<Button
												type="button"
												onClick={() => handleRequestApply(preset)}
												className="w-full text-xs font-bold py-1.5"
												rounded="xl"
												color="primary"
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

			{selectedPresetToApply && (
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
			)}
		</>
	)
}

export const PresetLayoutModal = memo(PresetLayoutModalComponent)
