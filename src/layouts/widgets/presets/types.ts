import type { StoredWidget } from '../layout-engine/types'

export interface PresetLayout {
	id: string
	title: string
	description: string
	isVip: boolean
	isFeatured: boolean
	category: 'featured' | 'minimal' | 'productivity' | 'lifestyle' | 'finance' | 'daily'
	verticalAlign?: 'top' | 'center' | 'bottom'
	widgets: StoredWidget[]
}
