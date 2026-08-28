import moment from 'jalali-moment'
import { AvatarComponent, FloatingBadge } from '@/components/ui'
import { UserCoin } from './user-coin'
import { Icon } from '@/src/icons'
import { useAuth } from '@/context/auth.context'

interface ProfileHeaderProps {
	onClickAvatar: () => void
	showEditBadge: (field: string) => boolean
}
const slots = [
	{ dx: 70, dy: -48, baseRotate: 15 }, // Top Right
	{ dx: -75, dy: -22, baseRotate: -20 }, // Top Left
	{ dx: -80, dy: 45, baseRotate: -10 }, // Bottom Left
	{ dx: 75, dy: 32, baseRotate: 20 }, // Bottom Right
	{ dx: 0, dy: -70, baseRotate: 5 }, // Top Center
	{ dx: -38, dy: 65, baseRotate: -15 }, // Bottom Left-Center
	{ dx: 55, dy: 65, baseRotate: 10 }, // Bottom Right-Center
	{ dx: -92, dy: 10, baseRotate: 25 }, // Left
]
export const ProfileHeader = ({ onClickAvatar, showEditBadge }: ProfileHeaderProps) => {
	const { user } = useAuth()

	const badges = user?.badges || []

	const seed = (user?.username?.length || 0) + (user?.name?.length || 0)

	return (
		<div className="relative flex flex-col items-center justify-center border bg-base-100/50 border-base-300 rounded-3xl">
			<div className="absolute z-10 top-4 left-4">
				<UserCoin coins={user?.coins || 0} />
			</div>

			<div className="absolute z-10 text-xs font-medium bottom-4 left-4 opacity-70">
				<span>
					شروعِ ماجرا از{' '}
					{moment(user?.joinedAt).locale('fa').format('jMMMM jYYYY')}
				</span>
			</div>

			<div className="z-10 flex flex-col items-center">
				<div className="relative flex items-center justify-center w-52 h-42">
					<div className="relative mb-8 rounded-full shadow-lg">
						<AvatarComponent
							url={user?.avatar || ''}
							placeholder={user?.name || 'کاربر'}
							size="xl"
							onClick={onClickAvatar}
							className="w-16 h-16 text-2xl transition-all cursor-pointer ring-4 ring-primary/20"
						/>
						<button
							type="button"
							onClick={onClickAvatar}
							className="absolute z-30 p-1 text-white transition-all -translate-x-3 translate-y-3 rounded-full shadow-xl cursor-pointer bottom-2 -right-3 bg-primary hover:scale-110 active:scale-95"
						>
							<Icon name="cameraPlus" size={12} />
						</button>
					</div>

					{showEditBadge('avatar') && (
						<span className="absolute w-2.5 h-2.5 rounded-full right-10 bottom-10 -translate-x-1 translate-y-1 bg-error animate-pulse z-30"></span>
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
									className="absolute z-20"
									style={{ top: `${top}px`, left: `${left}px` }}
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
						<h2 className="text-xl font-bold text-center text-content">
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
