import { AvatarComponent } from '../avatar.component'

export interface UserCardUser {
	name: string
	avatar: string
	username: string
	userId?: string
	extras?: {
		activity?: string
		selectedWallpaper?: string
	}
}

interface UserCardProps {
	user: UserCardUser
	className?: string
}

export function UserCard({ user, className = '' }: UserCardProps) {
	return (
		<div className={`${className}`}>
			<div
				className={
					'flex flex-col overflow-hidden border border-gray-700 rounded-lg shadow-xl bg-widget widget-wrapper'
				}
			>
				<div className="w-full h-16 bg-gray-900"></div>

				<div className="px-4 pb-4">
					<div className="relative mb-3 -mt-8">
						<div className="w-16 h-16 overflow-hidden border-2 border-gray-800 rounded-full">
							<AvatarComponent
								url={user.avatar}
								placeholder={user.username}
								size="xl"
							/>
						</div>
					</div>

					<div className="mb-4">
						<p className={'text-xl font-bold text-content'}>{user.name}</p>
						<div className={'text-sm font-bold text-muted'}>
							@{user.username}
						</div>

						{user.extras?.activity && (
							<div className="flex items-center mt-2 text-sm text-gray-300">
								<span className={'text-content opacity-85'}>
									{user.extras.activity}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
