import { BsGenderAmbiguous, BsGenderFemale, BsGenderMale } from 'react-icons/bs'
import { FiAtSign, FiCalendar, FiEdit, FiMail } from 'react-icons/fi'
import { AvatarComponent } from '@/components/avatar.component'
import { Button } from '@/components/button/button'
import { OfflineIndicator } from '@/components/offline-indicator'
import type { UserProfile } from '@/services/hooks/user/userService.hook'

interface ProfileDisplayProps {
	profile?: UserProfile
	onEditToggle: () => void
}

const getGenderInfo = (gender: 'MALE' | 'FEMALE' | 'OTHER' | null | undefined) => {
	if (gender === 'MALE')
		return {
			label: 'مرد',
			icon: <BsGenderMale className="text-blue-500" />,
			color: 'text-blue-500',
		}
	if (gender === 'FEMALE')
		return {
			label: 'زن',
			icon: <BsGenderFemale className="text-pink-500" />,
			color: 'text-pink-500',
		}
	if (gender === 'OTHER')
		return {
			label: 'دیگر',
			icon: <BsGenderAmbiguous className="text-purple-500" />,
			color: 'text-purple-500',
		}
	return {
		label: 'نامشخص',
		icon: <BsGenderAmbiguous className="text-content" />,
		color: 'text-content',
	}
}

export const ProfileDisplay = ({ profile, onEditToggle }: ProfileDisplayProps) => {
	return (
		<div className="relative mb-2 overflow-hidden border border-content rounded-2xl">
			<div className="relative p-4">
				<div className="flex flex-col items-center gap-3 md:flex-row md:items-start">
					{/* Avatar Section */}
					<div className="relative flex-shrink-0 group">
						<div className="absolute transition-opacity duration-300 rounded-full -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 group-hover:opacity-40"></div>
						<AvatarComponent
							url={profile?.avatar || null}
							placeholder={profile?.name || 'کاربر'}
							size="xl"
							className="relative border-4 shadow-2xl border-white/20 backdrop-blur-sm"
						/>
					</div>

					{/* Profile Info */}
					<div className="flex-1 space-y-4 text-center md:text-right">
						<div>
							<div className="flex flex-row items-center justify-start mb-2">
								<h1 className="text-3xl font-bold text-content">
									{profile?.name || 'کاربر'}{' '}
								</h1>
							</div>
							<div className="grid items-center justify-center grid-cols-2 gap-1 text-sm text-content/70">
								<div className="flex items-center gap-1 px-2 py-1.5 bg-content rounded-full">
									<FiAtSign size={12} />
									<span>{profile?.username || '-'}</span>
								</div>
								<div className="flex items-center gap-1 px-2 py-1.5 bg-content rounded-full">
									<FiMail size={12} />
									<span className="truncate dir-ltr">
										{profile?.email}
									</span>
								</div>
								<div className="flex items-center gap-1 px-2 py-1.5 bg-content rounded-full">
									{getGenderInfo(profile?.gender).icon}
									<span
										className={`font-medium ${getGenderInfo(profile?.gender).color}`}
									>
										جنسیت:{' '}
										{getGenderInfo(profile?.gender).label || 'نامشخص'}
									</span>
								</div>
								{/* birthday */}
								<div className="flex items-center gap-1 px-2 py-1.5 bg-content rounded-full">
									<FiCalendar size={12} />
									<span>{profile?.birthDate || '-'}</span>
								</div>
							</div>
						</div>

						<div className="flex justify-center gap-1 md:justify-start">
							<Button
								onClick={onEditToggle}
								className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-white transition-all duration-300 transform shadow-lg hover:scale-105 bg-primary rounded-2xl"
								size="sm"
							>
								<FiEdit size={16} />
								ویرایش پروفایل
							</Button>
						</div>
					</div>
				</div>
				{profile?.inCache && (
					<div className="w-full p-1">
						<OfflineIndicator mode="notification" />
					</div>
				)}
			</div>
		</div>
	)
}
