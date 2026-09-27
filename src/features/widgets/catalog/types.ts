import type { WidgetCategory } from '@/features/widgets/utils/layout-engine/types'

export interface AddWidgetModalProps {
	isOpen: boolean
	editTarget?: {
		instanceId: string
		widgetId: string
	} | null
	onClose: () => void
}

interface CategoryItem {
	id: WidgetCategory
	label: string
}

export const CATEGORIES: CategoryItem[] = [
	{ id: 'all', label: 'همه' },
	{ id: 'time', label: 'زمان و تاریخ' },
	{ id: 'productivity', label: 'ابزار و تسک' },
	{ id: 'info', label: 'اطلاعات و رسانه' },
	{ id: 'lifestyle', label: 'سرگرمی' },
]
