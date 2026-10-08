import type { MessageKey } from '@/common/i18n'
import type { WidgetCategory } from '@/features/widgets/utils/layout-engine/types'

export interface AddWidgetModalProps {
	isOpen: boolean
	editTarget?: {
		instanceId: string
		widgetId: string
	} | null
	onClose: () => void
	returnsToSettings?: boolean
}

export interface CategoryItem {
	id: WidgetCategory
	labelKey: MessageKey
}

export const CATEGORIES: CategoryItem[] = [
	{ id: 'all', labelKey: 'widgets.catalog.category.all' },
	{ id: 'time', labelKey: 'widgets.catalog.category.time' },
	{ id: 'productivity', labelKey: 'widgets.catalog.category.productivity' },
	{ id: 'info', labelKey: 'widgets.catalog.category.info' },
	{ id: 'lifestyle', labelKey: 'widgets.catalog.category.lifestyle' },
]
