import { AvatarComponent } from '@/components/ui'
import { Tooltip } from '@/components/ui'
import { Icon } from '@/icons'

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
							isOwner ? 'ring-2 ring-warning' : 'ring-2 ring-content'
						}`}
					>
						<AvatarComponent
							url={avatar}
							placeholder={name}
							className="object-cover w-full h-full"
						/>
					</div>

					{completed && (
						<div className="absolute inset-0 flex items-center justify-center rounded-full bg-success-subtle">
							<Icon name="check" className="text-success text-[8px]" />
						</div>
					)}

					{isOwner && (
						<div className="absolute flex items-center justify-center w-2 h-2 -translate-x-1/2 rounded-full shadow-md left-1/2 -bottom-1.5 bg-warning text-warning-content ring-2 ring-content">
							<Icon name="crown" size={6} />
						</div>
					)}
				</div>
			</div>
		</Tooltip>
	)
}
