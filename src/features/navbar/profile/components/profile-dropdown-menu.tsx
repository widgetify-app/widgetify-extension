import { callEvent } from '@/common/utils/call-event'
import {
	AvatarComponent,
	DropdownDivider,
	DropdownItem,
	EmptyArt,
	VipBadge,
} from '@/components/ui'
import { Icon } from '@/icons'
import type { UserProfile } from '@/services/user/user-service.hook'
import { t } from '@/common/i18n'

interface ProfileDropdownMenuProps {
	user: UserProfile | null
	isAuthenticated: boolean
	isVip: boolean
	onRequestAuth: () => void
	onRequestLogout: () => void
}

export function ProfileDropdownMenu({
	user,
	isAuthenticated,
	isVip,
	onRequestAuth,
	onRequestLogout,
}: ProfileDropdownMenuProps) {
	const handleAction = (action: () => void) => {
		callEvent('closeAllDropdowns')
		action()
	}

	const handleProfileClick = () => {
		handleAction(() => {
			if (!isAuthenticated) {
				onRequestAuth()
			} else {
				callEvent('openSettings', 'profile')
			}
		})
	}

	return (
		<div className="bg-glass-surface-2 py-2 min-w-52 px-1" dir="rtl">
			{isAuthenticated ? (
				<button
					type="button"
					onClick={handleProfileClick}
					className="flex items-center w-full gap-3 px-3.5 py-2.5 text-start cursor-pointer border-b border-line transition-colors hover:bg-fill-2"
				>
					<div className="shrink-0 flex items-center justify-center">
						<AvatarComponent url={user?.avatar} size="sm" isPro={isVip} />
					</div>
					<div className="flex flex-col min-w-0 flex-1 justify-center">
						<div className="flex items-center gap-1.5 leading-tight">
							<span className="text-xs font-bold text-fg truncate">
								{user?.name ||
									user?.username ||
									t('navbar.profile.defaultName')}
							</span>
							{isVip && <VipBadge size="xs" variant="subtle" iconOnly />}
						</div>
						<span className="text-2xs text-fg-muted truncate leading-body">
							{t('navbar.profile.view')}
						</span>
					</div>
				</button>
			) : (
				<button
					type="button"
					onClick={handleProfileClick}
					className="flex items-center w-full gap-3 px-3.5 py-2.5 text-start cursor-pointer border-b border-line transition-colors hover:bg-fill-2"
				>
					<EmptyArt name="account" className="size-10" />
					<div className="flex flex-col flex-1">
						<span className="text-xs font-bold text-fg">
							{t('navbar.profile.login')}
						</span>
						<span className="text-3xs text-fg-muted">
							{t('navbar.profile.loginHint')}
						</span>
					</div>
				</button>
			)}

			<div className="py-1">
				<DropdownItem
					icon={<Icon name="settings" size={14} />}
					label={t('navbar.profile.settings')}
					onClick={() =>
						handleAction(() => callEvent('openSettings', 'general'))
					}
				/>

				<DropdownItem
					icon={<Icon name="shoppingBag" size={14} />}
					label={t('navbar.profile.market')}
					onClick={() => handleAction(() => callEvent('openMarketModal'))}
				/>

				<DropdownItem
					icon={<Icon name="diamond" size={14} />}
					label={t('navbar.profile.pro')}
					badge={
						!isVip ? <VipBadge size="xs" text={t('ui.vip.pro')} /> : undefined
					}
					onClick={() => handleAction(() => callEvent('openSettings', 'vip'))}
				/>
			</div>

			{isAuthenticated && (
				<>
					<DropdownDivider />
					<DropdownItem
						variant="danger"
						icon={<Icon name="logOut" size={14} />}
						label={t('navbar.profile.logout')}
						onClick={() => handleAction(onRequestLogout)}
					/>
				</>
			)}
		</div>
	)
}
