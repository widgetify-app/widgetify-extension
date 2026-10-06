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
					label="دوستان"
					isActive={selectedFriends.length > 0}
				>
					{selectedFriends.length > 0
						? `${selectedFriends.length} دوست`
						: undefined}
				</TodoComposerTool>
			}
			position="top-right"
		>
			<div className="p-2 min-w-xs min-h-80 max-h-80">
				<p className="mb-1 text-xs font-bold ps-1 text-fg-strong">
					افزودن دوست به تسک
				</p>
				<div className="h-56 max-h-56">
					<SelectFriendLayout
						onChange={(f) => setSelectedFriends([...f])}
						title="افزودن دوست به تسک"
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
					ذخیره و بستن
				</Button>
			</div>
		</Dropdown>
	)
}
