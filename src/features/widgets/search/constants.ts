import { t } from '@/common/i18n'
import type { EngineMeta } from '@/services/trends/get-trends.hook'

export const DEFAULT_ENGINE: EngineMeta = {
	id: 'google',
	prefix: '',
	label: t('widgets.search.engine.google'),
	icon: '',
}

export const SEARCH_HISTORY_LIMIT = 8
