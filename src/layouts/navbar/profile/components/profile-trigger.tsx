import { AvatarComponent } from '@/components/ui'
import { Icon } from '@/icons'
import type { UserProfile } from '@/services/hooks/user/user-service.hook'

interface ProfileTriggerProps {
	user: UserProfile | null
	isAuthenticated: boolean
	profilePercentage: number | null
}

export function ProfileTrigger({
	user,
	isAuthenticated,
	profilePercentage,
}: ProfileTriggerProps) {
	if (!isAuthenticated) {
		return (
			<div
				id="profile-button"
				className="relative flex items-center justify-center cursor-pointer select-none"
			>
				<div className="relative p-2 transition-all cursor-pointer nav-btn text-base-content/40 hover:text-base-content active:scale-90">
					<Icon name="user" size={15} />
				</div>
			</div>
		)
	}

	return (
		<div
			id="profile-button"
			className="relative flex items-center justify-center cursor-pointer select-none"
		>
			<div className="relative flex items-center justify-center cursor-pointer group">
				{profilePercentage ? (
					<div
						className="absolute z-10 outline-2 outline-primary/40 radial-progress text-primary/80 pointer-events-none"
						style={{
							// @ts-expect-error
							'--value': profilePercentage,
							'--size': '2rem',
						}}
						aria-valuenow={0}
						role="progressbar"
					/>
				) : null}
				<div className="relative flex items-center justify-center">
					<AvatarComponent
						url={user?.avatar}
						size="sm"
						isPro={!profilePercentage && Boolean(user?.isVip)}
					/>
				</div>
			</div>
		</div>
	)
}
