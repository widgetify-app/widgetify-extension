import { t } from '@/common/i18n'
import { EmptyState } from '@/components/ui'

interface Prop {
	emptyMessage?: string
}

export function FriendEmptyList({ emptyMessage }: Prop) {
	return (
		<EmptyState
			icon="users"
			title={emptyMessage || t('friends.empty.list')}
			description={emptyMessage ? t('friends.empty.list') : undefined}
		/>
	)
}
