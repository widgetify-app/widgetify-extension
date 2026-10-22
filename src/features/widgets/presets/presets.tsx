import type React from 'react'
import { memo, useState } from 'react'
import Analytics from '@/analytics'
import { Button, ConfirmationModal, VipBadge } from '@/components/ui'
import { Icon } from '@/icons'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { useAuth } from '@/context/auth.context'
import { useFreeWidgetActions, useWidgetSlots } from '@/features/widgets/widgets.context'
import { getWidgetRegistry } from '../registry'
import { PRESET_LAYOUTS } from './constants'
import { PresetCanvasPreview } from './components/preset-canvas-preview'
import { resolvePresetWidgetsForViewport } from './utils/viewport'
import type { PresetLayout } from './types'
import { t } from '@/common/i18n'

interface PresetLayoutListProps {
	onLeave: () => void
}

const MAX_VISIBLE_WIDGETS = 5

const PresetLayoutListComponent: React.FC<PresetLayoutListProps> = ({ onLeave }) => {
	const { isVip } = useAuth()
	const { applyPresetLayout } = useFreeWidgetActions()
	const { canUseSlots, activeSlot } = useWidgetSlots()

	const [selectedPresetToApply, setSelectedPresetToApply] =
		useState<PresetLayout | null>(null)
	const [isApplying, setIsApplying] = useState(false)

	const handleOpenVipSettings = () => {
		Analytics.event('widget_presets_pro_locked')
		callEvent('openSettings', 'vip')
		onLeave()
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
			Analytics.event('widget_presets_applied')
			setSelectedPresetToApply(null)
			onLeave()
		} finally {
			setIsApplying(false)
		}
	}

	return (
		<>
			<div className="flex flex-col flex-1 min-h-0 gap-3 text-right">
				<p className="text-2xs leading-relaxed text-fg-muted shrink-0">
					{canUseSlots
						? t('widgets.presets.slotHint', { slot: activeSlot.label })
						: t('widgets.presets.modalHint')}
				</p>

				<ul className="grid flex-1 min-h-0 grid-cols-2 gap-3 p-1 overflow-y-auto lg:grid-cols-3">
					{PRESET_LAYOUTS.map((preset) => {
						const isLocked = preset.isVip && !isVip
						const widgetIds = Array.from(
							new Set(preset.widgets.map((widget) => widget.id))
						)
						const visibleWidgetIds = widgetIds.slice(0, MAX_VISIBLE_WIDGETS)
						const hiddenWidgetCount =
							widgetIds.length - visibleWidgetIds.length

						return (
							<li key={preset.id} className="flex">
								<article
									className={cn(
										'group flex flex-col w-full gap-3 p-3.5 text-right border rounded-2xl bg-fill shadow-sm transition-ui hover:shadow-md',
										preset.isVip
											? 'border-vip-fill-2 hover:border-vip'
											: 'border-line hover:border-brand-muted'
									)}
								>
									<PresetCanvasPreview preset={preset} />

									<div className="flex flex-col gap-2">
										<div className="flex items-start justify-between gap-2">
											<h4 className="text-sm font-bold truncate text-fg">
												{t(preset.titleKey)}
											</h4>

											{preset.isVip ? (
												<VipBadge
													size="xs"
													variant="subtle"
													className="mt-0.5"
													text={t('ui.vip.pro')}
												/>
											) : (
												<span className="mt-0.5 shrink-0 rounded-full border border-success-fill-2 bg-success-fill px-2 py-0.5 text-4xs font-bold text-success">
													{t('widgets.presets.free')}
												</span>
											)}
										</div>

										<p className="text-2xs leading-relaxed text-fg-muted line-clamp-2 min-h-8">
											{t(preset.descriptionKey)}
										</p>

										<ul className="flex flex-wrap items-center gap-1">
											{visibleWidgetIds.map((widgetId) => {
												const definition =
													getWidgetRegistry()[widgetId]
												if (!definition) return null

												return (
													<li
														key={widgetId}
														className="inline-flex items-center gap-1 rounded-lg border border-line bg-fill px-1.5 py-0.5 text-3xs font-medium text-fg-muted"
													>
														<Icon
															name={definition.icon}
															size={12}
														/>
														<span className="truncate max-w-20">
															{t(definition.label)}
														</span>
													</li>
												)
											})}

											{hiddenWidgetCount > 0 && (
												<li
													dir="ltr"
													className="rounded-lg border border-line px-1.5 py-0.5 text-3xs font-medium text-fg-muted"
												>
													{`+${hiddenWidgetCount.toLocaleString('fa-IR')}`}
												</li>
											)}
										</ul>
									</div>

									<div className="pt-3 mt-auto border-t border-line">
										{isLocked ? (
											<Button
												onClick={handleOpenVipSettings}
												fullWidth
												size="sm"
												rounded="xl"
												variant="outline"
												color="vip"
												className="font-bold"
												icon={<Icon name="diamond" size={12} />}
												aria-label={t(
													'widgets.presets.upgradeAria',
													{ title: t(preset.titleKey) }
												)}
											>
												<span>
													{t('widgets.presets.upgrade')}
												</span>
											</Button>
										) : (
											<Button
												onClick={() => handleRequestApply(preset)}
												fullWidth
												size="sm"
												rounded="xl"
												color="brand"
												className="font-bold shadow-sm"
												aria-label={t(
													'widgets.presets.applyAria',
													{ title: t(preset.titleKey) }
												)}
											>
												<span>{t('widgets.presets.apply')}</span>
											</Button>
										)}
									</div>
								</article>
							</li>
						)
					})}
				</ul>
			</div>

			{selectedPresetToApply && (
				<ConfirmationModal
					isOpen={Boolean(selectedPresetToApply)}
					onClose={() => {
						if (!isApplying) setSelectedPresetToApply(null)
					}}
					onConfirm={handleConfirmApply}
					isLoading={isApplying}
					title={t('widgets.presets.confirmTitle')}
					message={
						canUseSlots
							? t('widgets.presets.confirmMessageInSlot', {
									title: t(selectedPresetToApply.titleKey),
									slot: activeSlot.label,
								})
							: t('widgets.presets.confirmMessage', {
									title: t(selectedPresetToApply.titleKey),
								})
					}
					confirmText={t('widgets.presets.confirm')}
					cancelText={t('ui.common.cancel')}
					variant="warning"
				/>
			)}
		</>
	)
}

export const PresetLayoutList = memo(PresetLayoutListComponent)
