import { callEvent } from '@/common/utils/call-event'
import { Button, Dropdown } from '@/components/ui'
import { SelectFriendLayout } from '@/layouts/friends/components/select-friend.layout'
import type { Friend } from '@/services/hooks/friends/friend-service.hook'
import { Icon } from '@/src/icons'

interface Prop {
	selectedFriends: Friend[]
	setSelectedFriends: any
}
export function TodoSelectFriends({ selectedFriends, setSelectedFriends }: Prop) {
	return (
		<Dropdown
			trigger={
				<Button
					type="button"
					size="sm"
					rounded={'xl'}
					className="p-2 border text-[10px]  text-muted shrink-0 active:scale-95"
				>
					{selectedFriends.length > 0 ? (
						<div className="flex gap-0.5 text-base-content/40">
							{selectedFriends.length}
							<p>دوست</p>
						</div>
					) : (
						<div className="flex gap-0.5 text-base-content/40">
							<Icon
								name="friends"
								size={16}
								className="text-base-content/40"
							/>
							دوستان
						</div>
					)}
				</Button>
			}
			dropdownClassName="select-friends"
			position="top-right"
		>
			<div className="p-2 border min-w-xs min-h-80 max-h-80 bg-base-200 border-base-300 rounded-2xl">
				<p className="pr-1 mb-1 text-sm font-bold">افزودن دوست به تسک</p>
				<div className="h-56 max-h-56">
					<SelectFriendLayout
						onChange={(f) => setSelectedFriends([...f])}
						title="افزودن دوست به تسک"
						selectedFriendIds={selectedFriends?.map((f: any) => f.id) || []}
					/>
				</div>
				<Button
					size="sm"
					variant={'primary'}
					rounded={'2xl'}
					onClick={() => callEvent('closeAllDropdowns')}
					className="w-full"
				>
					ذخیره و بستن
				</Button>
			</div>
		</Dropdown>
	)
}
