import { DEFAULT_TOOLS_TAB } from '../constants'
import { ToolsTab, type ToolsTabType } from '../types'

export function normalizeToolsTab(stored?: string | null): ToolsTabType {
	if (!stored) return DEFAULT_TOOLS_TAB

	return stored in ToolsTab ? (stored as ToolsTabType) : DEFAULT_TOOLS_TAB
}
