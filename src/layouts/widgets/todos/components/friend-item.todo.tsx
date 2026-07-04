import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import { Icon } from '@/src/icons'

interface UserItemProp {
	avatar: string
	isOwner: boolean
	completed: boolean
	name: string
}
export function UserItem({ avatar, completed, isOwner, name }: UserItemProp) {
	return (
		<Tooltip content={name}>
			<div className="overflow-visible avatar">
				<div className="relative w-5 h-5 overflow-visible ">
					<div
						className={`w-full h-full rounded-full overflow-hidden ${
							isOwner ? 'ring-2 ring-warning' : 'ring-2 ring-base-200'
						}`}
					>
						<AvatarComponent
							url={avatar}
							placeholder={name}
							// size="xs"
							className="object-cover w-full h-full"
						/>
					</div>

					{completed && (
						<div className="absolute inset-0 flex items-center justify-center rounded-full bg-success/20">
							<Icon name="check" className="text-success text-[8px]" />
						</div>
					)}

					{isOwner && (
						<div className="absolute flex items-center justify-center w-2 h-2 -translate-x-1/2 rounded-full shadow-md left-1/2 -bottom-1.5 bg-warning text-warning-content ring-2 ring-base-100">
							<Icon name="crown" size={6} />
						</div>
					)}
				</div>
			</div>
		</Tooltip>
	)
}
