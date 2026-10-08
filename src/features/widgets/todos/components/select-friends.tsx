import { t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import { Button, Dropdown } from '@/components/ui'
import { SelectFriendLayout } from '@/features/friends/friends'
import type { Friend } from '@/services/friends/friend-service.hook'
import { TodoComposerTool } from './todo-composer-tool'

interface Prop {
	selectedFriends: Friend[]
	setSelectedFriends: (friends: Friend[]) => void
}
export function TodoSelectFriends({ selectedFriends, setSelectedFriends }: Prop) {
	return (
		<Dropdown
			trigger={
				<TodoComposerTool
					icon="friends"
					label={t('widgets.todos.friends.label')}
					isActive={selectedFriends.length > 0}
				>
					{selectedFriends.length > 0
						? t('widgets.todos.friends.count', {
								p0: selectedFriends.length,
							})
						: undefined}
				</TodoComposerTool>
			}
			position="top-right"
		>
			<div className="p-2 min-w-xs min-h-80 max-h-80">
				<p className="mb-1 text-xs font-bold ps-1 text-fg-strong">
					{t('widgets.todos.friends.addAria')}
				</p>
				<div className="h-56 max-h-56">
					<SelectFriendLayout
						onChange={(f) => setSelectedFriends([...f])}
						title={t('widgets.todos.friends.addAria')}
						selectedFriendIds={selectedFriends?.map((f) => f.id) || []}
					/>
				</div>
				<Button
					size="sm"
					color="brand"
					rounded="xl"
					onClick={() => callEvent('closeAllDropdowns')}
					className="w-full"
				>
					{t('widgets.todos.friends.saveClose')}
				</Button>
			</div>
		</Dropdown>
	)
}
