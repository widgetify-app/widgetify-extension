import type React from 'react'
import { memo, useState } from 'react'
import { Button, ConfirmationModal, Modal, VipBadge } from '@/components/ui'
import { Icon } from '@/icons'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
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

const MAX_VISIBLE_WIDGETS = 5

const PresetLayoutModalComponent: React.FC<PresetLayoutModalProps> = ({
	isOpen,
	onClose,
}) => {
	const { isVip } = useAuth()
	const { applyPresetLayout } = useFreeWidgetActions()

	const [selectedPresetToApply, setSelectedPresetToApply] =
		useState<PresetLayout | null>(null)
	const [isApplying, setIsApplying] = useState(false)

	const handleOpenVipSettings = () => {
		callEvent('openSettings', 'vip')
		onClose()
	}

	const handleRequestApply = (preset: PresetLayout) => {
		if (preset.isVip && !isVip) {
			handleOpenVipSettings()
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
					<span className="flex items-center gap-2">
						<span className="flex items-center justify-center rounded-lg w-7 h-7 bg-brand-subtle text-primary shrink-0">
							<Icon name="viewGridAdd" size={16} />
						</span>
						<span>چیدمان‌های آماده</span>
					</span>
				}
			>
				<div className="flex flex-col flex-1 min-h-0 gap-3 text-right">
					<p className="text-[11px] leading-relaxed text-muted shrink-0">
						یکی از این قالب‌ها رو انتخاب کن تا ویجت‌های صفحه‌ی اصلی با همون
						چیدمان جایگزین بشن.
					</p>

					<ul className="grid flex-1 min-h-0 grid-cols-1 gap-3 p-1 overflow-y-auto sm:grid-cols-2">
						{PRESET_LAYOUTS.map((preset) => {
							const isLocked = preset.isVip && !isVip
							const widgetIds = Array.from(
								new Set(preset.widgets.map((widget) => widget.id))
							)
							const visibleWidgetIds = widgetIds.slice(
								0,
								MAX_VISIBLE_WIDGETS
							)
							const hiddenWidgetCount =
								widgetIds.length - visibleWidgetIds.length

							return (
								<li key={preset.id} className="flex">
									<article
										className={cn(
											'group flex flex-col w-full gap-3 p-3.5 text-right border rounded-2xl bg-subtle shadow-2xs transition-ui hover:shadow-md',
											preset.isVip
												? 'border-vip-muted hover:border-vip-strong'
												: 'border-subtle hover:border-brand-strong'
										)}
									>
										<PresetCanvasPreview preset={preset} />

										<div className="flex flex-col gap-2">
											<div className="flex items-start justify-between gap-2">
												<h4 className="text-sm font-bold leading-6 truncate text-content">
													{preset.title}
												</h4>

												{preset.isVip ? (
													<VipBadge
														size="xs"
														variant="indigo-subtle"
														className="mt-0.5"
													/>
												) : (
													<span className="mt-0.5 shrink-0 rounded-full border border-success-muted bg-success-subtle px-2 py-0.5 text-[9px] font-bold text-success">
														رایگان
													</span>
												)}
											</div>

											<p className="text-[11px] leading-relaxed text-muted line-clamp-2 min-h-8">
												{preset.description}
											</p>

											<ul className="flex flex-wrap items-center gap-1">
												{visibleWidgetIds.map((widgetId) => {
													const definition =
														WIDGET_DEFINITIONS[widgetId]
													if (!definition) return null

													return (
														<li
															key={widgetId}
															className="inline-flex items-center gap-1 rounded-lg border border-subtle bg-subtle px-1.5 py-0.5 text-[10px] font-medium text-muted"
														>
															<Icon
																name={definition.icon}
																size={11}
															/>
															<span className="truncate max-w-20">
																{definition.label}
															</span>
														</li>
													)
												})}

												{hiddenWidgetCount > 0 && (
													<li
														dir="ltr"
														className="rounded-lg border border-subtle px-1.5 py-0.5 text-[10px] font-medium text-muted"
													>
														{`+${hiddenWidgetCount.toLocaleString('fa-IR')}`}
													</li>
												)}
											</ul>
										</div>

										<div className="pt-3 mt-auto border-t border-subtle">
											{isLocked ? (
												<Button
													onClick={handleOpenVipSettings}
													fullWidth
													size="sm"
													rounded="xl"
													variant="outline"
													color="vip"
													className="font-bold"
													icon={
														<Icon name="diamond" size={13} />
													}
													aria-label={`ارتقا به پرو برای چیدمان ${preset.title}`}
												>
													<span>ارتقا به پرو</span>
												</Button>
											) : (
												<Button
													onClick={() =>
														handleRequestApply(preset)
													}
													fullWidth
													size="sm"
													rounded="xl"
													color="primary"
													className="font-bold shadow-xs"
													aria-label={`اعمال چیدمان ${preset.title}`}
												>
													<span>اعمال چیدمان</span>
												</Button>
											)}
										</div>
									</article>
								</li>
							)
						})}
					</ul>
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
					message={`با اعمال چیدمان «${selectedPresetToApply.title}»، ویجت‌ها و چیدمان فعلی جایگزین می‌شن. مطمئنی؟`}
					confirmText="آره، اعمال کن"
					cancelText="انصراف"
					variant="warning"
				/>
			)}
		</>
	)
}

export const PresetLayoutModal = memo(PresetLayoutModalComponent)
