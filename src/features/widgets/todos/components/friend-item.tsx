import { cn } from '@/common/utils/cn'
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
			<div className="relative inline-flex align-middle overflow-visible border-4 rounded-full border-surface">
				<div className="relative overflow-visible size-5">
					<div
						className={cn(
							'size-full rounded-full overflow-hidden ring-2',
							isOwner ? 'ring-warning' : 'ring-surface-3'
						)}
					>
						<AvatarComponent
							url={avatar}
							placeholder={name}
							className="object-cover w-full h-full"
						/>
					</div>

					{completed && (
						<div className="absolute inset-0 flex items-center justify-center rounded-full bg-success-fill-2">
							<Icon name="check" size={8} className="text-success" />
						</div>
					)}

					{isOwner && (
						<div className="absolute flex items-center justify-center size-2 -translate-x-1/2 rounded-full shadow-md left-1/2 -bottom-1.5 bg-warning text-on-warning ring-2 ring-surface">
							<Icon name="crown" size={8} />
						</div>
					)}
				</div>
			</div>
		</Tooltip>
	)
}
