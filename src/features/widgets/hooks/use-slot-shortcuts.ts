import { useEffect } from 'react'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { useWidgetSlots } from '../widgets.context'
import { SLOT_WORKSPACES } from '../utils/slots/slot-access'
import { slotShortcutIndex } from '../utils/slots/slot-shortcut'

export function useSlotShortcuts() {
	const { openSlot, slots } = useWidgetSlots()

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const index = slotShortcutIndex(event)
			if (index === null) return

			const target = event.target as HTMLElement | null
			if (
				target &&
				(target.tagName === 'INPUT' ||
					target.tagName === 'TEXTAREA' ||
					target.isContentEditable)
			) {
				return
			}

			event.preventDefault()
			const workspace = SLOT_WORKSPACES[index]
			const name = slots.find((slot) => slot.workspace === workspace)?.label ?? ''
			openSlot(workspace).then((switched) => {
				if (switched) showToast(t('widgets.slots.switchedTo', { name }), 'info')
			})
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [openSlot, slots])
}
