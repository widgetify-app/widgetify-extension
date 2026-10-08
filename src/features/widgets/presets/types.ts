import type { MessageKey } from '@/common/i18n'
import type { StoredWidget } from '../utils/layout-engine/types'

export interface PresetLayout {
	id: string
	titleKey: MessageKey
	descriptionKey: MessageKey
	isVip: boolean
	isFeatured: boolean
	category: 'featured' | 'minimal' | 'productivity' | 'lifestyle' | 'finance' | 'daily'
	verticalAlign?: 'top' | 'center' | 'bottom' | 'split-bottom'
	widgets: StoredWidget[]
}
