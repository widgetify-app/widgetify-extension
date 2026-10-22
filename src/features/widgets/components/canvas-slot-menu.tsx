import { useRef, useState } from 'react'
import { t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import {
	PopoverMenu,
	PopoverMenuDivider,
	PopoverMenuItem,
	Spinner,
	VipBadge,
} from '@/components/ui'
import { Icon } from '@/icons'
import { useWidgetSlots } from '../widgets.context'

export function CanvasSlotMenu() {
	const { canUseSlots, activeSlot, slots, isSwitching, openSlot } = useWidgetSlots()
	const triggerRef = useRef<HTMLButtonElement>(null)
	const [isOpen, setIsOpen] = useState(false)

	const choose = (action: () => void) => {
		setIsOpen(false)
		action()
	}

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-label={t('widgets.slots.switcherAria')}
				onClick={() => setIsOpen((open) => !open)}
				className="px-3 py-1.5 text-xs font-bold rounded-xl bg-surface-3 hover:bg-fill-2 text-fg active:scale-95 transition-ui flex items-center gap-1.5 cursor-pointer whitespace-nowrap focus-visible:focus-ring"
			>
				{isSwitching ? (
					<Spinner size="xs" aria-hidden="true" />
				) : (
					<Icon name="layout" size={12} aria-hidden="true" />
				)}
				<span className="truncate max-w-28">
					{canUseSlots ? activeSlot.label : t('widgets.slots.title')}
				</span>
				<Icon name="chevronDown" size={12} aria-hidden="true" />
			</button>

			<PopoverMenu
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				triggerRef={triggerRef}
				placement="top-center"
				width={224}
			>
				{canUseSlots ? (
					slots.map((slot) => (
						<PopoverMenuItem
							key={slot.workspace}
							icon={
								<Icon
									name={slot.isActive ? 'check' : 'layout'}
									size={14}
								/>
							}
							label={slot.label}
							description={
								slot.isEmpty
									? t('widgets.slots.empty')
									: t('widgets.slots.widgetCount', {
											count: slot.widgets.length.toLocaleString(
												'fa-IR'
											),
										})
							}
							badge={
								slot.isLocked ? (
									<VipBadge size="xs" text={t('ui.vip.pro')} />
								) : undefined
							}
							variant={slot.isActive ? 'primary' : 'default'}
							disabled={isSwitching}
							onClick={() => choose(() => openSlot(slot.workspace))}
						/>
					))
				) : (
					<PopoverMenuItem
						icon={<Icon name="user" size={14} />}
						label={t('widgets.slots.loginShort')}
						onClick={() => choose(() => callEvent('openProfile'))}
					/>
				)}
				<PopoverMenuDivider />
				<PopoverMenuItem
					icon={<Icon name="squares2X2" size={14} />}
					label={t('widgets.slots.manage')}
					onClick={() =>
						choose(() => callEvent('openWidgetSlotsModal', 'slots'))
					}
				/>
			</PopoverMenu>
		</>
	)
}
