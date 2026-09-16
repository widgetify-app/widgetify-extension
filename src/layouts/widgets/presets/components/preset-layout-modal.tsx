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

	const [selectedPresetToApply, setSelectedPresetToApply] =
		useState<PresetLayout | null>(null)
	const [isApplying, setIsApplying] = useState(false)

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
				size="xl"
				className="w-[calc(100vw-2rem)] max-w-4xl h-[min(650px,calc(100dvh-4rem))] flex flex-col p-4 md:p-5"
				direction="rtl"
				showCloseButton={true}
				title={
					<div className="flex items-center gap-2">
						<span>چیدمان‌های آماده</span>
						<span className="text-xs font-normal text-muted bg-base-200 px-2 py-0.5 rounded-lg">
							قالب‌های طراحی‌شده و استاندارد
						</span>
					</div>
				}
			>
				<div className="flex flex-col flex-1 min-h-0 gap-3 text-right">
					<div className="grid flex-1 min-h-0 grid-cols-1 gap-3 p-1 overflow-y-auto sm:grid-cols-2">
						{PRESET_LAYOUTS.map((preset) => {
							const isVipRequired = preset.isVip && !isVip
							const uniqueWidgetIds = Array.from(
								new Set(preset.widgets.map((w) => w.id))
							)

							return (
								<div
									key={preset.id}
									className={cn(
										'flex flex-col justify-between gap-3 p-3.5 rounded-2xl bg-base-200/40 hover:bg-base-200/80 border transition-all text-right group shadow-2xs hover:shadow-xs',
										preset.isVip
											? 'border-vip/20 hover:border-vip/40'
											: 'border-base-content/10 hover:border-base-content/20'
									)}
								>
									<div className="flex flex-col gap-2.5">
										<div className="relative overflow-hidden rounded-xl">
											<PresetCanvasPreview
												preset={preset}
												isCompact={true}
												className="border-0 bg-base-300/40 group-hover:scale-[1.01] transition-transform duration-300"
											/>
										</div>

										<div className="flex flex-col gap-1.5">
											<div className="flex items-center justify-between gap-1">
												<span className="text-sm font-extrabold truncate text-content">
													{preset.title}
												</span>

												{preset.isVip ? (
													<span className="flex items-center gap-1 text-[10px] font-bold text-vip bg-vip/10 border border-vip/20 px-2 py-0.5 rounded-full shrink-0">
														<Icon name="diamond" size={11} />
														<span>پرو</span>
													</span>
												) : (
													<span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
														رایگان
													</span>
												)}
											</div>

											<p className="text-[11px] text-muted line-clamp-2 leading-relaxed h-8">
												{preset.description}
											</p>

											<div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 scrollbar-none">
												{uniqueWidgetIds.map((widgetId) => {
													const def =
														WIDGET_DEFINITIONS[
															widgetId as keyof typeof WIDGET_DEFINITIONS
														]
													if (!def) return null

													return (
														<span
															key={widgetId}
															className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-base-300/60 border border-base-content/5 shrink-0 text-[10px] font-medium text-muted hover:text-content transition-colors"
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

									<div className="pt-1 border-t border-base-content/5">
										{isVipRequired ? (
											<Button
												type="button"
												onClick={() => {
													callEvent('openSettings', 'vip')
													onClose()
												}}
												className="w-full gap-1.5 text-xs font-bold py-2"
												rounded="xl"
												variant="outline"
												color="vip"
											>
												<Icon name="diamond" size={13} />
												<span>ارتقا به پرو برای این چیدمان</span>
											</Button>
										) : (
											<Button
												type="button"
												onClick={() => handleRequestApply(preset)}
												className="w-full text-xs font-bold py-2 shadow-xs"
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
