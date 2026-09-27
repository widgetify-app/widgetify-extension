import type { EngineMeta } from '@/services/trends/get-trends.hook'

export const DEFAULT_ENGINE: EngineMeta = {
	id: 'google',
	prefix: '',
	label: 'گوگل',
	icon: '',
}

export const SEARCH_HISTORY_LIMIT = 8
