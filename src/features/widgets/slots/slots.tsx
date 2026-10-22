import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import {
	Button,
	ConfirmationModal,
	EmptyState,
	Kbd,
	Modal,
	TabNavigation,
} from '@/components/ui'
import { Icon } from '@/icons'
import { PresetLayoutList } from '../presets/presets'
import { useFreeWidgetActions, useWidgetSlots } from '../widgets.context'
import type { WidgetSlotsTab, WidgetSlotView } from '../types'
import { SlotCard, type SlotStart } from './components/slot-card'

interface WidgetSlotsModalProps {
	isOpen: boolean
	tab: WidgetSlotsTab
	onTabChange: (tab: WidgetSlotsTab) => void
	onClose: () => void
}

const IS_MAC = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)

export function WidgetSlotsModal({
	isOpen,
	tab,
	onTabChange,
	onClose,
}: WidgetSlotsModalProps) {
	const { canUseSlots, slots, isSwitching, switchSlot, renameSlot, clearSlot } =
		useWidgetSlots()
	const { setCanvasMode } = useFreeWidgetActions()
	const [clearTarget, setClearTarget] = useState<WidgetSlotView | null>(null)
	const [isClearOpen, setIsClearOpen] = useState(false)

	useEffect(() => {
		if (isOpen && tab === 'presets') Analytics.event('widget_presets_opened')
	}, [isOpen, tab])

	const handleSwitch = async (slot: WidgetSlotView) => {
		if (await switchSlot(slot.workspace)) onClose()
	}

	const handleStart = async (slot: WidgetSlotView, start: SlotStart) => {
		if (!(await switchSlot(slot.workspace, []))) return

		Analytics.event('widget_slot_created', { start })
		if (start === 'presets') {
			onTabChange('presets')
			return
		}
		onClose()
		setCanvasMode('edit')
		showToast(t('widgets.slots.created', { name: slot.label }), 'success')
	}

	const handleUpgrade = () => {
		Analytics.event('widget_slot_pro_locked')
		callEvent('openSettings', 'vip')
		onClose()
	}

	const handleLogin = () => {
		callEvent('openProfile')
		onClose()
	}

	const handleConfirmClear = () => {
		if (clearTarget) clearSlot(clearTarget.workspace)
		setIsClearOpen(false)
	}

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="xl"
				className="w-[calc(100vw-2rem)] max-w-4xl h-[min(720px,calc(100dvh-4rem))] flex flex-col p-4 md:p-5"
				showCloseButton={true}
				closeLabel={t('ui.common.close')}
				title={
					<span className="flex items-center gap-2">
						<span className="flex items-center justify-center rounded-lg w-7 h-7 bg-brand-fill text-brand shrink-0">
							<Icon name="layout" size={16} />
						</span>
						<span>{t('widgets.slots.manage')}</span>
					</span>
				}
			>
				<div className="flex flex-col flex-1 min-h-0 gap-3 text-right">
					<TabNavigation
						tabs={[
							{
								id: 'slots' as const,
								label: t('widgets.slots.title'),
								icon: <Icon name="squares2X2" size={14} />,
							},
							{
								id: 'presets' as const,
								label: t('widgets.slots.presetsTab'),
								icon: <Icon name="viewGridAdd" size={14} />,
							},
						]}
						activeTab={tab}
						onTabClick={onTabChange}
						tabMode="simple"
						size="sm"
						className="self-start shrink-0"
					/>

					{tab === 'presets' ? (
						<PresetLayoutList onLeave={onClose} />
					) : (
						<>
							<p className="text-2xs leading-relaxed text-fg-muted shrink-0">
								{t('widgets.slots.modalHint')}
							</p>

							{canUseSlots ? (
								<ul className="grid flex-1 min-h-0 grid-cols-2 gap-3 p-1 overflow-y-auto lg:grid-cols-3">
									{slots.map((slot) => (
										<li key={slot.workspace} className="flex">
											<SlotCard
												slot={slot}
												disabled={isSwitching}
												onSwitch={() => handleSwitch(slot)}
												onStart={(start) =>
													handleStart(slot, start)
												}
												onRename={(name) =>
													renameSlot(slot.workspace, name)
												}
												onRequestClear={() => {
													setClearTarget(slot)
													setIsClearOpen(true)
												}}
												onUpgrade={handleUpgrade}
											/>
										</li>
									))}
								</ul>
							) : (
								<EmptyState
									icon="account"
									title={t('widgets.slots.loginTitle')}
									description={t('widgets.slots.loginHint')}
									className="flex-1"
									action={
										<Button
											onClick={handleLogin}
											size="sm"
											rounded="xl"
											color="brand"
										>
											{t('widgets.slots.login')}
										</Button>
									}
								/>
							)}

							{canUseSlots && (
								<p className="flex flex-wrap items-center gap-1.5 pt-2 border-t text-2xs text-fg-muted border-line shrink-0">
									<Icon name="shortcuts" size={12} aria-hidden="true" />
									<span>{t('widgets.slots.shortcutHint')}</span>
									<span dir="ltr" className="flex items-center gap-1">
										<Kbd>{IS_MAC ? '⌘' : 'Ctrl'}</Kbd>+<Kbd>Alt</Kbd>+
										<Kbd>1…6</Kbd>
									</span>
								</p>
							)}
						</>
					)}
				</div>
			</Modal>

			<ConfirmationModal
				isOpen={isClearOpen}
				onClose={() => setIsClearOpen(false)}
				onConfirm={handleConfirmClear}
				title={t('widgets.slots.clearTitle')}
				message={t('widgets.slots.clearMessage', {
					name: clearTarget?.label ?? '',
				})}
				confirmText={t('widgets.slots.clearConfirm')}
				cancelText={t('widgets.slots.clearCancel')}
				variant="danger"
			/>
		</>
	)
}
