import { useRef, useState } from 'react'
import moment from 'jalali-moment'
import {
	AvatarComponent,
	Button,
	FloatingBadge,
	PopoverMenu,
	PopoverMenuItem,
	Tooltip,
} from '@/components/ui'
import { UserCoin } from '@/components/user-coin'
import { Icon } from '@/icons'
import { useAuth } from '@/context/auth.context'
import {
	formatVipExpiryDate,
	formatVipRemaining,
} from '@/features/setting/account/utils/vip-expiry'
import { callEvent } from '@/common/utils/call-event'

interface ProfileHeaderProps {
	onUploadFile: (file: File) => void
	onSelectFromGallery: () => void
	showEditBadge: (field: string) => boolean
}
const slots = [
	{ dx: 70, dy: -48, baseRotate: 15 },
	{ dx: -75, dy: -22, baseRotate: -20 },
	{ dx: -80, dy: 45, baseRotate: -10 },
	{ dx: 75, dy: 32, baseRotate: 20 },
	{ dx: 0, dy: -70, baseRotate: 5 },
	{ dx: -38, dy: 65, baseRotate: -15 },
	{ dx: 55, dy: 65, baseRotate: 10 },
	{ dx: -92, dy: 10, baseRotate: 25 },
]
export const ProfileHeader = ({
	onUploadFile,
	onSelectFromGallery,
	showEditBadge,
}: ProfileHeaderProps) => {
	const { user } = useAuth()
	const [menuOpen, setMenuOpen] = useState(false)
	const avatarAnchorRef = useRef<HTMLButtonElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const badges = user?.badges || []

	const seed = (user?.username?.length || 0) + (user?.name?.length || 0)

	const vipRemaining = formatVipRemaining(user?.vipExpiresAt)
	const vipExpiryDate = formatVipExpiryDate(user?.vipExpiresAt)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			onUploadFile(file)
		}
		e.target.value = ''
	}

	return (
		<div className="relative flex flex-col items-center justify-center border bg-surface-veil border-surface-3 rounded-widget">
			<input
				ref={fileInputRef}
				type="file"
				accept="image/png,image/jpeg,image/webp"
				className="hidden"
				onChange={handleFileChange}
			/>

			<div className="absolute z-10 top-4 left-4">
				<UserCoin coins={user?.coins || 0} />
			</div>

			{user?.vipExpiresAt ? (
				<div className="absolute z-10 top-4 right-4">
					<Tooltip
						content={
							vipExpiryDate ? `اعتبار تا ${vipExpiryDate}` : 'اشتراک پرو'
						}
					>
						<Button
							type="button"
							onClick={() => callEvent('openSettings', 'vip')}
							variant="outline"
							color="vip"
							size="sm"
							rounded="2xl"
							className="px-2.5 font-bold"
						>
							<Icon name="diamond" size={12} />
							<span>اعتبار پرو: {vipRemaining}</span>
						</Button>
					</Tooltip>
				</div>
			) : user?.isVip ? (
				<div className="absolute z-10 top-4 right-4">
					<Button
						type="button"
						onClick={() => callEvent('openSettings', 'vip')}
						variant="outline"
						color="vip"
						size="sm"
						rounded="2xl"
						className="px-2.5 font-bold"
					>
						<Icon name="diamond" size={12} />
						<span>اشتراک پرو</span>
					</Button>
				</div>
			) : null}

			<div className="absolute z-10 text-xs font-medium bottom-4 left-4 opacity-70">
				<span>
					شروعِ ماجرا از{' '}
					{moment(user?.joinedAt).locale('fa').format('jMMMM jYYYY')}
				</span>
			</div>

			<div className="z-10 flex flex-col items-center">
				<div className="relative flex items-center justify-center w-52 h-42">
					<button
						ref={avatarAnchorRef}
						type="button"
						aria-label="تغییر تصویر پروفایل"
						aria-haspopup="menu"
						aria-expanded={menuOpen}
						onClick={() => setMenuOpen((prev) => !prev)}
						className="relative mb-8 rounded-full shadow-lg cursor-pointer focus-visible:focus-ring"
					>
						<AvatarComponent
							url={user?.avatar || ''}
							placeholder={user?.name || 'کاربر'}
							size="xl"
							className="w-16 h-16 text-2xl transition-ui ring-4 ring-brand-fill-2"
						/>
						<span
							aria-hidden="true"
							className="absolute z-30 p-1 text-on-brand transition-ui -translate-x-3 translate-y-3 rounded-full shadow-xl bottom-2 -right-3 bg-brand hover:scale-110 active:scale-95"
						>
							<Icon name="camera" size={12} />
						</span>
					</button>

					<PopoverMenu
						isOpen={menuOpen}
						onClose={() => setMenuOpen(false)}
						triggerRef={avatarAnchorRef}
						placement="bottom-center"
						width={200}
					>
						<PopoverMenuItem
							icon={<Icon name="uploadImage" size={14} />}
							label="بارگذاری از دستگاه"
							onClick={() => {
								setMenuOpen(false)
								fileInputRef.current?.click()
							}}
						/>
						<PopoverMenuItem
							icon={<Icon name="image" size={14} />}
							label="انتخاب از گالری"
							onClick={() => {
								setMenuOpen(false)
								onSelectFromGallery()
							}}
						/>
					</PopoverMenu>

					{showEditBadge('avatar') && (
						<span className="absolute w-2.5 h-2.5 rounded-full right-10 bottom-10 -translate-x-1 translate-y-1 bg-danger animate-pulse z-30"></span>
					)}

					{(() => {
						return badges.map((badge, i) => {
							const slot = slots[i % slots.length]
							const jitterX = ((seed * 3 + i * 7) % 11) - 5
							const jitterY = ((seed * 5 + i * 11) % 11) - 5
							const rotate = slot.baseRotate + ((seed + i * 13) % 11) - 5
							const left = 104 + slot.dx + jitterX - 16
							const top = 74 + slot.dy + jitterY - 16
							return (
								<div
									key={`${badge.id}-${i}`}
									className="absolute z-20 animate-bounce-slow"
									style={{
										top: `${top}px`,
										left: `${left}px`,
										animationDelay: `${i * 0.4}s`,
									}}
								>
									<FloatingBadge
										name={badge.label}
										src={badge.icon}
										rotate={rotate}
										scale={1}
										glowColor={badge.glowColor}
									/>
								</div>
							)
						})
					})()}

					<div className="absolute left-0 right-0 z-40 flex flex-col items-center bottom-2">
						<h2 className="text-xl font-bold text-center text-fg">
							{user?.name || 'کاربر'}
						</h2>
						<p className="text-sm opacity-60 text-center mt-0.5" dir="ltr">
							@{user?.username || '-'}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
