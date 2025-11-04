import moment from 'jalali-moment'
import { BsGenderAmbiguous, BsGenderFemale, BsGenderMale } from 'react-icons/bs'
import { FiAtSign, FiCalendar, FiEdit, FiMail } from 'react-icons/fi'
import { AvatarComponent } from '@/components/avatar.component'
import { Button } from '@/components/button/button'
import { OfflineIndicator } from '@/components/offline-indicator'
import type { UserProfile } from '@/services/hooks/user/userService.hook'
import { UserCoin } from './user-coin'

interface ProfileDisplayProps {
	profile?: UserProfile
	onEditToggle: () => void
}

const getGenderInfo = (gender: 'MALE' | 'FEMALE' | 'OTHER' | null | undefined) => {
	if (gender === 'MALE')
		return {
			label: 'مذکر',
			icon: <BsGenderMale />,
		}
	if (gender === 'FEMALE')
		return {
			label: 'مؤنث',
			icon: <BsGenderFemale />,
		}
	if (gender === 'OTHER')
		return {
			label: 'نامشخص',
			icon: <BsGenderAmbiguous />,
		}

	return {
		label: 'نامشخص',
		icon: <BsGenderAmbiguous />,
	}
}

const formatJalaliDate = (dateString: string | null | undefined): string => {
	if (!dateString) return '-'
	try {
		const jalaliDate = moment(dateString, 'jYYYY-jMM-jDD')

		if (!jalaliDate.isValid()) {
			return dateString
		}

		return jalaliDate.locale('fa').format('jD jMMMM jYYYY')
	} catch {
		return dateString
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
							<div className="flex flex-row items-center justify-between gap-3 mb-2">
								<h1 className="text-3xl font-bold text-content">
									{profile?.name || 'کاربر'}{' '}
								</h1>
								{profile?.coins !== undefined && (
									<UserCoin coins={profile?.coins || 0} />
								)}
							</div>
							<div className="grid items-center justify-center grid-cols-2 gap-1 text-sm text-content/70">
								<div className="flex items-center gap-1 px-2 py-1.5 bg-content rounded-2xl">
									<FiAtSign size={12} />
									<span>{profile?.username || '-'}</span>
								</div>
								<div className="flex items-center gap-1 px-2 py-1.5 bg-content rounded-2xl">
									<FiMail size={12} />
									<span className="truncate dir-ltr">
										{profile?.email}
									</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-content">
									<div className="flex-shrink-0">
										{getGenderInfo(profile?.gender).icon}
									</div>
									<span className="font-medium">
										{getGenderInfo(profile?.gender).label}
									</span>
								</div>
								{/* birthday */}
								<div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-content">
									<FiCalendar size={14} className="flex-shrink-0" />
									<span className="font-medium dir-rtl">
										{formatJalaliDate(profile?.birthDate)}
									</span>
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
