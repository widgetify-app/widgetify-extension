import { AvatarComponent, ProgressRing } from '@/components/ui'
import type { UserProfile } from '@/services/user/user-service.hook'
import { NavIconButton } from '../../components/nav-icon-button'
import { t } from '@/common/i18n'

interface ProfileTriggerProps {
	user: UserProfile | null
	isAuthenticated: boolean
	profilePercentage: number | null
	onClick?: () => void
}

export function ProfileTrigger({
	user,
	isAuthenticated,
	profilePercentage,
	onClick,
}: ProfileTriggerProps) {
	if (!isAuthenticated) {
		return (
			<NavIconButton
				id="profile-button"
				icon="user"
				label={t('navbar.profile.triggerLogin')}
				onClick={onClick}
			/>
		)
	}

	return (
		<button
			type="button"
			id="profile-button"
			aria-label={
				profilePercentage
					? t('navbar.profile.triggerProgress', { percent: profilePercentage })
					: t('navbar.profile.trigger')
			}
			onClick={onClick}
			className="relative flex items-center justify-center cursor-pointer select-none group"
		>
			{profilePercentage ? (
				<ProgressRing
					aria-hidden="true"
					value={profilePercentage}
					size="2rem"
					className="absolute z-10 outline-2 outline-brand-muted text-brand pointer-events-none"
				/>
			) : null}
			<div className="relative flex items-center justify-center">
				<AvatarComponent
					url={user?.avatar}
					size="sm"
					isPro={!profilePercentage && Boolean(user?.isVip)}
				/>
			</div>
		</button>
	)
}
