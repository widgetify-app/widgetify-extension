import { AvatarComponent } from '@/components/avatar.component'

interface Prop {
	avatar: string
	name: string
	username: string | null
	actions: React.ReactNode
}
export function FriendItem({ avatar, name, username, actions }: Prop) {
	return (
		<div className="flex items-center justify-between p-3 transition-all duration-200 border rounded-xl border-content hover:shadow-sm">
			<div className="flex items-center flex-1 min-w-0 gap-1.5">
				<div className="relative shrink-0">
					<div className="w-8 h-8 overflow-hidden rounded-full ring-2 ring-base-300">
						<AvatarComponent
							url={avatar}
							placeholder={name}
							size="md"
							className="object-cover w-full h-full"
						/>
					</div>
				</div>

				<div className="flex-1 min-w-0">
					<div className="text-sm font-medium truncate text-content">
						{name}
					</div>
					<div className="text-xs truncate text-base-content/60">
						{username}@
					</div>
				</div>
			</div>

			<div className="flex items-center gap-2 shrink-0">{actions}</div>
		</div>
	)
}
