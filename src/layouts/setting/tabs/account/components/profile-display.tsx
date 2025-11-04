import moment from 'jalali-moment'
import { BsGenderAmbiguous, BsGenderFemale, BsGenderMale } from 'react-icons/bs'
import { FiCalendar, FiEdit, FiMail } from 'react-icons/fi'
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
		<div className="relative mb-4 overflow-hidden border border-base-300/50 rounded-2xl bg-gradient-to-br from-base-100/80 to-base-200/60 backdrop-blur-xl">
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-0 left-0 w-24 h-24 -translate-x-12 -translate-y-12 rounded-full bg-gradient-to-br from-primary/30 to-transparent"></div>
				<div className="absolute bottom-0 right-0 w-20 h-20 translate-x-10 translate-y-10 rounded-full bg-gradient-to-tl from-secondary/30 to-transparent"></div>
			</div>

			<div className="relative p-4">
				<div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
					<div className="relative flex-shrink-0 group">
						<div className="relative p-0.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm">
							<AvatarComponent
								url={profile?.avatar || null}
								placeholder={profile?.name || 'کاربر'}
								size="lg"
								className="relative border-2 shadow-xl border-base-content/10 backdrop-blur-sm"
							/>
						</div>
						<div className="absolute w-3 h-3 border-2 rounded-full shadow-md bottom-1 right-1 bg-success border-base-100"></div>
					</div>

					<div className="flex-1 space-y-4 text-center md:text-right">
						<div className="space-y-2">
							<div className="flex flex-col items-center justify-between gap-2 md:flex-row md:items-start">
								<div className="space-y-0.5">
									<h1 className="text-xl font-bold text-base-content bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text">
										{profile?.name || 'کاربر'}
									</h1>
									<p className="text-xs font-medium text-base-content/60">
										@{profile?.username || '-'}
									</p>
								</div>
								{profile?.coins !== undefined && (
									<div className="transition-all duration-300 transform hover:scale-105">
										<UserCoin coins={profile?.coins || 0} />
									</div>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
							<div className="flex items-center gap-2.5 px-3 py-2.5 transition-all duration-300 border bg-base-100/50 border-content rounded-2xl backdrop-blur-sm hover:bg-base-100/70 sm:col-span-2">
								<div className="flex items-center justify-center flex-shrink-0 rounded-lg w-7 h-7 bg-gradient-to-br from-primary/20 to-primary/10">
									<FiMail size={12} className="text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-base-content/60 mb-0.5">
										ایمیل
									</p>
									<p className="text-sm font-medium truncate text-base-content dir-ltr">
										{profile?.email || '-'}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-2.5 px-3 py-2.5 transition-all duration-300 border bg-base-100/50 border-content rounded-2xl backdrop-blur-sm hover:bg-base-100/70">
								<div className="flex items-center justify-center flex-shrink-0 rounded-lg w-7 h-7 bg-gradient-to-br from-secondary/20 to-secondary/10">
									{getGenderInfo(profile?.gender).icon && (
										<div className="text-sm text-secondary">
											{getGenderInfo(profile?.gender).icon}
										</div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-base-content/60 mb-0.5">
										جنسیت
									</p>
									<p className="text-sm font-medium text-base-content">
										{getGenderInfo(profile?.gender).label}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-2.5 px-3 py-2.5 transition-all duration-300 border bg-base-100/50 border-content rounded-2xl backdrop-blur-sm hover:bg-base-100/70 sm:col-span-3">
								<div className="flex items-center justify-center flex-shrink-0 rounded-lg w-7 h-7 bg-gradient-to-br from-accent/20 to-accent/10">
									<FiCalendar size={12} className="text-accent" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-base-content/60 mb-0.5">
										تاریخ تولد
									</p>
									<p className="text-sm font-medium text-base-content dir-rtl">
										{formatJalaliDate(profile?.birthDate)}
									</p>
								</div>
							</div>
						</div>

						<div className="flex justify-center md:justify-start">
							<Button
								onClick={onEditToggle}
								className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 transform border shadow-md bg-gradient-to-r from-primary to-primary/90 rounded-2xl hover:shadow-lg hover:scale-105 hover:from-primary/90 hover:to-primary backdrop-blur-sm border-primary/20"
								size="sm"
							>
								<FiEdit size={14} />
								ویرایش پروفایل
							</Button>
						</div>
					</div>
				</div>

				{profile?.inCache && (
					<div className="w-full p-1 mt-3">
						<OfflineIndicator mode="notification" />
					</div>
				)}
			</div>
		</div>
	)
}
