import { AvatarComponent } from '@/components/ui'
import type { UserProfile } from '@/services/user/user-service.hook'
import { NavIconButton } from '../../components/nav-icon-button'

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
		return <NavIconButton id="profile-button" icon="user" label="ورود یا ثبت‌نام" />
	}

	return (
		<button
			type="button"
			id="profile-button"
			aria-label={
				profilePercentage ? `پروفایل، ${profilePercentage}٪ تکمیل شده` : 'پروفایل'
			}
			className="relative flex items-center justify-center cursor-pointer select-none group"
		>
			{profilePercentage ? (
				<div
					aria-hidden="true"
					className="absolute z-10 outline-2 outline-brand-muted radial-progress text-brand pointer-events-none"
					style={{
						// @ts-expect-error
						'--value': profilePercentage,
						'--size': '2rem',
					}}
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
