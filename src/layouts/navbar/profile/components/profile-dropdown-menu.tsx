import { AvatarComponent, DropdownDivider, DropdownItem, VipBadge } from '@/components/ui'
import { Icon } from '@/icons'
import type { UserProfile } from '@/services/hooks/user/user-service.hook'

interface ProfileDropdownMenuProps {
	user: UserProfile | null
	isAuthenticated: boolean
	isVip: boolean
	onProfileClick: () => void
	onOpenSettingTab: (tab: string) => void
	onAddWidget: () => void
	onRequestLogout: () => void
}

export function ProfileDropdownMenu({
	user,
	isAuthenticated,
	isVip,
	onProfileClick,
	onOpenSettingTab,
	onAddWidget,
	onRequestLogout,
}: ProfileDropdownMenuProps) {
	return (
		<div className="bg-content py-2 bg-glass min-w-52" dir="rtl">
			{isAuthenticated ? (
				<div
					onClick={onProfileClick}
					className="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer border-b border-base-content/10 transition-colors hover:bg-base-200/50"
				>
					<div className="shrink-0 flex items-center justify-center">
						<AvatarComponent url={user?.avatar} size="sm" isPro={isVip} />
					</div>
					<div className="flex flex-col min-w-0 flex-1 justify-center">
						<div className="flex items-center gap-1.5 leading-tight">
							<span className="text-xs font-bold text-content truncate">
								{user?.name || user?.username || 'کاربر ویجتیفای'}
							</span>
							{isVip && (
								<VipBadge size="xs" variant="indigo-subtle" iconOnly />
							)}
						</div>
						<span className="text-[11px] text-muted truncate leading-normal">
							مشاهده پروفایل
						</span>
					</div>
				</div>
			) : (
				<div
					onClick={onProfileClick}
					className="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer border-b border-base-content/10 transition-colors hover:bg-base-200/50"
				>
					<div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
						<Icon name="user" size={15} />
					</div>
					<div className="flex flex-col flex-1">
						<span className="text-xs font-bold text-content">
							ورود یا ثبت‌نام
						</span>
						<span className="text-[10px] text-muted">
							همگام‌سازی و دسترسی به امکانات
						</span>
					</div>
				</div>
			)}

			<div className="py-1">
				<DropdownItem
					icon={<Icon name="settings" size={14} />}
					label="تنظیمات"
					onClick={() => onOpenSettingTab('general')}
				/>

				<DropdownItem
					icon={<Icon name="appsPlus" size={14} />}
					label="مدیریت ویجت‌ها"
					onClick={onAddWidget}
				/>

				<DropdownItem
					icon={<Icon name="outlineCrown" size={14} />}
					label="ویجتیفای پرو"
					badge={!isVip ? <VipBadge size="xs" /> : undefined}
					onClick={() => onOpenSettingTab('vip')}
				/>
			</div>

			{isAuthenticated && (
				<>
					<DropdownDivider />
					<DropdownItem
						variant="danger"
						icon={<Icon name="logOut" size={14} />}
						label="خروج از حساب"
						onClick={onRequestLogout}
					/>
				</>
			)}
		</div>
	)
}
