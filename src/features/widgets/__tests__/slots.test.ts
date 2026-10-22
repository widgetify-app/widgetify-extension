import { describe, expect, it } from 'bun:test'
import type { StoredWallpaper } from '@/common/types/wallpaper.interface'
import type { StoredWidget } from '../utils/layout-engine/types'
import { WidgetKeys } from '../utils/layout-engine/types'
import type { SlotLook } from '../types'
import {
	isServerWorkspace,
	isSlotLocked,
	SLOT_WORKSPACES,
} from '../utils/slots/slot-access'
import {
	normalizeActiveSlot,
	normalizeSlotName,
	normalizeSlots,
} from '../utils/slots/normalize-slots'
import {
	findSlot,
	lookChanges,
	withActiveSlot,
	withoutSlot,
	withSlotName,
	withStashedSlot,
} from '../utils/slots/slot-list'
import { slotShortcutIndex } from '../utils/slots/slot-shortcut'

const SERVER_ID = '0123456789abcdef01234567'

function widget(
	instanceId: string,
	id: StoredWidget['id'] = WidgetKeys.clock
): StoredWidget {
	return { id, instanceId, position: { col: 0, row: 0 }, size: { w: 2, h: 2 } }
}

const forest: StoredWallpaper = {
	id: 'forest',
	type: 'IMAGE',
	src: 'https://cdn/forest.jpg',
}
const sunset: StoredWallpaper = {
	id: 'sunset',
	type: 'GRADIENT',
	src: '',
	gradient: { from: 'orange', to: 'purple', direction: 'to-r' },
}

function look(overrides: Partial<SlotLook> = {}): SlotLook {
	return {
		theme: 'light',
		fontFamily: 'Vazir',
		browserTitle: { id: 'default', name: '', template: '✨ New Tab' },
		wallpaper: forest,
		...overrides,
	}
}

function key(
	code: string,
	overrides: Partial<Parameters<typeof slotShortcutIndex>[0]> = {}
) {
	return {
		code,
		altKey: true,
		ctrlKey: true,
		metaKey: false,
		shiftKey: false,
		repeat: false,
		...overrides,
	}
}

describe('slot access', () => {
	it('keeps the first two slots free and the other four for pro', () => {
		expect(SLOT_WORKSPACES.filter((slot) => isSlotLocked(slot, false))).toEqual([
			'SLOT_3',
			'SLOT_4',
			'SLOT_5',
			'SLOT_6',
		])
		expect(SLOT_WORKSPACES.some((slot) => isSlotLocked(slot, true))).toBe(false)
	})

	it('talks to the server only for the first slot, so slots 2 to 6 never touch the account', () => {
		expect(SLOT_WORKSPACES.filter(isServerWorkspace)).toEqual(['HOME'])
		expect(isServerWorkspace(null)).toBe(false)
	})
})

describe('normalizeActiveSlot', () => {
	it('falls back to the first slot for anything it does not know', () => {
		expect(normalizeActiveSlot('SLOT_4')).toBe('SLOT_4')
		expect(normalizeActiveSlot('SLOT_7')).toBe('HOME')
		expect(normalizeActiveSlot(null)).toBe('HOME')
		expect(normalizeActiveSlot(3)).toBe('HOME')
	})
})

describe('normalizeSlotName', () => {
	it('trims, caps at 24 characters and reads a blank name as the default', () => {
		expect(normalizeSlotName('  کاری  ')).toBe('کاری')
		expect(normalizeSlotName('   ')).toBeNull()
		expect(normalizeSlotName(42)).toBeNull()
		expect(normalizeSlotName('x'.repeat(40))).toHaveLength(24)
	})
})

describe('normalizeSlots', () => {
	it('reads anything but an array as no slots', () => {
		expect(normalizeSlots(null)).toEqual([])
		expect(normalizeSlots({ HOME: [] })).toEqual([])
	})

	it('drops unknown workspaces and repeats, and keeps the first of each', () => {
		const slots = normalizeSlots([
			{ workspace: 'SLOT_2', name: 'اول', updatedAt: 5, widgets: [] },
			{ workspace: 'SLOT_2', name: 'دوم', updatedAt: 6, widgets: [] },
			{ workspace: 'SLOT_9', widgets: [] },
			'SLOT_3',
		])
		expect(slots).toEqual([
			{ workspace: 'SLOT_2', name: 'اول', updatedAt: 5, widgets: [], look: null },
		])
	})

	it('drops a malformed widget and keeps a partner widget row as it was', () => {
		const partner = {
			...widget('p-1', 'widget:weather-plus'),
			meta: { variant: 'wide' },
		}
		const [slot] = normalizeSlots([
			{
				workspace: 'SLOT_2',
				updatedAt: 'yesterday',
				widgets: [partner, { id: 'clock', instanceId: 'c-1' }, null],
			},
		])
		expect(slot.widgets).toEqual([partner])
		expect(slot.updatedAt).toBe(0)
		expect(slot.name).toBeNull()
	})

	it('keeps a valid look and drops the parts of it that are broken', () => {
		const [slot] = normalizeSlots([
			{
				workspace: 'SLOT_2',
				widgets: [],
				look: {
					theme: 'dark',
					fontFamily: '',
					browserTitle: { template: 'کار' },
					wallpaper: { id: 'x', type: 'GRADIENT', src: '' },
				},
			},
		])
		expect(slot.look).toEqual({
			theme: 'dark',
			fontFamily: null,
			browserTitle: { id: 'default', name: '', template: 'کار' },
			wallpaper: null,
		})
	})
})

describe('slot list', () => {
	it('stashes a layout and its look without losing the name the slot already has', () => {
		const named = withSlotName([], 'SLOT_2', 'کاری')
		const stashed = withStashedSlot(
			named,
			'SLOT_2',
			{ widgets: [widget('a')], look: look() },
			10
		)
		expect(findSlot(stashed, 'SLOT_2')).toEqual({
			workspace: 'SLOT_2',
			name: 'کاری',
			updatedAt: 10,
			widgets: [widget('a')],
			look: look(),
		})
	})

	it('switches out and back without mixing the two layouts or their looks', () => {
		const home = { widgets: [widget(SERVER_ID)], look: look() }
		const work = {
			widgets: [widget('work-1', WidgetKeys.todos)],
			look: look({ theme: 'dark' }),
		}
		const leavingHome = withStashedSlot(
			withStashedSlot([], 'SLOT_2', work, 1),
			'HOME',
			home,
			2
		)
		expect(findSlot(leavingHome, 'SLOT_2')).toMatchObject(work)
		const leavingWork = withStashedSlot(leavingHome, 'SLOT_2', work, 3)
		expect(findSlot(leavingWork, 'HOME')).toMatchObject(home)
	})

	it('drops the look of the slot that becomes active, since the live settings hold it', () => {
		const slots = withStashedSlot(
			[],
			'SLOT_2',
			{ widgets: [widget('a')], look: look() },
			1
		)
		expect(
			findSlot(withActiveSlot(slots, 'SLOT_2', undefined, 2), 'SLOT_2')
		).toMatchObject({
			widgets: [widget('a')],
			look: null,
		})
	})

	it('starts a new slot with no widgets, whatever an old entry held', () => {
		const slots = withStashedSlot(
			[],
			'SLOT_3',
			{ widgets: [widget('old')], look: look() },
			1
		)
		expect(findSlot(withActiveSlot(slots, 'SLOT_3', [], 2), 'SLOT_3')).toMatchObject({
			widgets: [],
			look: null,
			updatedAt: 2,
		})
	})

	it('removes a slot entirely, name and look included', () => {
		const slots = withStashedSlot(
			withSlotName([], 'SLOT_3', 'مطالعه'),
			'SLOT_3',
			{ widgets: [], look: look() },
			1
		)
		expect(withoutSlot(slots, 'SLOT_3')).toEqual([])
	})
})

describe('lookChanges', () => {
	it('changes only what differs from the live look', () => {
		expect(lookChanges(look(), look({ theme: 'dark', wallpaper: sunset }))).toEqual({
			theme: 'dark',
			wallpaper: sunset,
		})
	})

	it('changes nothing for a slot that has no look of its own yet', () => {
		expect(lookChanges(look(), null)).toEqual({})
	})

	it('keeps the live value where the slot has none', () => {
		expect(lookChanges(look(), look({ theme: null, wallpaper: null }))).toEqual({})
	})

	it('reads the same wallpaper as no change even when its keys come in another order', () => {
		const reordered = { src: forest.src, type: forest.type, id: forest.id }
		expect(lookChanges(look({ wallpaper: reordered }), look())).toEqual({})
	})

	it('restores the default tab title when the slot had none', () => {
		const custom = look({
			browserTitle: { id: 't1', name: 'Work', template: 'Work' },
		})
		expect(lookChanges(custom, look()).browserTitle?.template).toBe('✨ New Tab')
	})
})

describe('slotShortcutIndex', () => {
	it('maps Ctrl or Cmd with Alt and a digit to a slot', () => {
		expect(slotShortcutIndex(key('Digit1'))).toBe(0)
		expect(slotShortcutIndex(key('Numpad6'))).toBe(5)
		expect(slotShortcutIndex(key('Digit3', { ctrlKey: false, metaKey: true }))).toBe(
			2
		)
	})

	it('ignores other keys, extra modifiers, repeats and digits past the last slot', () => {
		expect(slotShortcutIndex(key('Digit7'))).toBeNull()
		expect(slotShortcutIndex(key('KeyT'))).toBeNull()
		expect(slotShortcutIndex(key('Digit1', { altKey: false }))).toBeNull()
		expect(slotShortcutIndex(key('Digit1', { ctrlKey: false }))).toBeNull()
		expect(slotShortcutIndex(key('Digit1', { shiftKey: true }))).toBeNull()
		expect(slotShortcutIndex(key('Digit1', { repeat: true }))).toBeNull()
	})
})
