import type { WidgetWorkspace } from '@/services/widgets/widget-sync.hook'

export const SLOT_WORKSPACES: readonly WidgetWorkspace[] = [
	'HOME',
	'SLOT_2',
	'SLOT_3',
	'SLOT_4',
	'SLOT_5',
	'SLOT_6',
]

const FREE_SLOT_COUNT = 2

export const SLOT_NAME_MAX_LENGTH = 24

export function isSlotLocked(workspace: WidgetWorkspace, isVip: boolean): boolean {
	return !isVip && SLOT_WORKSPACES.indexOf(workspace) >= FREE_SLOT_COUNT
}

export function isServerWorkspace(workspace: WidgetWorkspace | null): boolean {
	return workspace === 'HOME'
}
