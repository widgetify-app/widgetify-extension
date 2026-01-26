import moment from 'jalali-moment'
import { BsGenderAmbiguous, BsGenderFemale, BsGenderMale } from 'react-icons/bs'
import { FiCalendar, FiEdit, FiMail, FiPhone, FiUser } from 'react-icons/fi'
import { LuBriefcase, LuHeart } from 'react-icons/lu'
import { AvatarComponent } from '@/components/avatar.component'
import { Button } from '@/components/button/button'
import { OfflineIndicator } from '@/components/offline-indicator'
import type { UserProfile } from '@/services/hooks/user/userService.hook'
import { UserCoin } from './user-coin'
import React from 'react'
import { Chip } from '@/components/chip.component'

interface ProfileDisplayProps {
	profile?: UserProfile
	onEditToggle: () => void
}

const getGenderInfo = (gender: 'MALE' | 'FEMALE' | 'OTHER' | null | undefined) => {
	if (gender === 'MALE') return { label: 'آقا هستم', icon: <BsGenderMale size={18} /> }
	if (gender === 'FEMALE')
		return { label: 'خانم هستم', icon: <BsGenderFemale size={18} /> }
	return { label: 'بماند', icon: <BsGenderAmbiguous size={18} /> }
}

const formatJalaliDate = (dateString: string | null | undefined): string => {
	if (!dateString) return 'تنظیم نشده'
	try {
		const jalaliDate = moment(dateString, 'jYYYY-jMM-jDD')
		return jalaliDate.isValid()
			? jalaliDate.locale('fa').format('jD jMMMM jYYYY')
			: dateString
	} catch {
		return dateString || '-'
	}
}

export const ProfileDisplay = ({ profile, onEditToggle }: ProfileDisplayProps) => {
	const genderInfo = getGenderInfo(profile?.gender)

	return (
		<div className="flex flex-col space-y-4">
			<div className="relative flex flex-col items-center p-2 overflow-hidden border bg-base-100/50 border-base-300/50 rounded-3xl">
				{profile?.joinedAt && (
					<div className="absolute -top-1 -left-1 group">
						<div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-primary/10  border border-primary/20 rounded-br-2xl rounded-tl-xl shadow-inner transform -rotate-2 group-hover:rotate-0 transition-all duration-300">
							<span className="text-primary animate-pulse">✨</span>
							<div className="flex flex-col items-start leading-none">
								<span className="text-xs font-medium opacity-70 mb-0.5">
									شروعِ ماجرا از
								</span>
								<span className="text-[10px] font-black text-primary">
									{moment(profile.joinedAt)
										.locale('fa')
										.format('jMMMM jYYYY')}
								</span>
							</div>
						</div>
					</div>
				)}
				<div className="relative group">
					<div className="p-1 rounded-full">
						<AvatarComponent
							url={profile?.avatar || null}
							placeholder={profile?.name || 'کاربر'}
							size="xl"
							className="border-4 border-base-100"
						/>
					</div>
					<div className="absolute w-5 h-5 border-4 rounded-full shadow-lg bottom-1 right-2 bg-success border-base-100"></div>
				</div>

				<h2 className="text-xl font-bold text-content">
					{profile?.name || 'کاربر'}
				</h2>
				<p className="text-sm opacity-60" dir="ltr">
					@{profile?.username || 'username'}
				</p>

				{profile?.coins !== undefined && (
					<div className="mt-1">
						<UserCoin coins={profile.coins} />
					</div>
				)}
			</div>

			<div className="overflow-hidden border border-base-300/50 rounded-2xl bg-base-100/30">
				<DisplayRow
					icon={<FiUser className="text-primary" />}
					label="نام و نام خانوادگی"
					value={profile?.name}
				/>

				<DisplayRow
					icon={<FiMail className="text-secondary" />}
					label="ایمیل"
					value={profile?.email}
					isLtr
				/>

				<DisplayRow
					icon={<FiPhone className="text-secondary" />}
					label="شماره همراه"
					value={profile?.phone}
					isLtr
				/>

				<DisplayRow
					icon={<div className="text-accent">{genderInfo.icon}</div>}
					label="جنسیت"
					value={genderInfo.label}
				/>

				<DisplayRow
					icon={<FiCalendar className="text-warning" />}
					label="تاریخ تولد"
					value={formatJalaliDate(profile?.birthDate)}
				/>

				<DisplayRow
					icon={<LuBriefcase className="text-info" />}
					label="شغل"
					value={profile?.occupation?.label}
				/>

				<DisplayRow
					icon={<LuHeart className="text-error" />}
					label="علایق"
					value={
						<div className="flex flex-wrap self-end justify-end flex-1 gap-1">
							{profile?.interests?.map((i) => (
								<Chip
									onClick={() => {}}
									selected={true}
									key={i.id}
									className="p-0! px-1!"
								>
									{i.label}
								</Chip>
							))}
						</div>
					}
				/>
			</div>

			<Button
				size="sm"
				onClick={onEditToggle}
				className="w-full h-10 gap-2 text-base text-white shadow-sm rounded-2xl bg-primary hover:bg-primary/90"
			>
				<FiEdit size={18} />
				ویرایش پروفایل
			</Button>

			{profile?.inCache && (
				<div className="pt-2">
					<OfflineIndicator mode="notification" />
				</div>
			)}
		</div>
	)
}

const DisplayRow = ({
	icon,
	label,
	value,
	isLtr = false,
}: {
	icon: React.ReactNode
	label: string
	value?: React.ReactNode
	isLtr?: boolean
}) => (
	<div className="flex items-center justify-between p-2 transition-colors border-b last:border-b-0 border-base-300/30 hover:bg-base-200/20">
		<div className="flex items-center gap-3">
			<div className="flex items-center justify-center w-7 h-7 rounded-xl bg-base-200/50">
				{icon}
			</div>
			<span className="text-[10px] font-medium opacity-60">{label}</span>
		</div>
		<span
			className={`text-xs w-52 text-end font-semibold text-content  max-h-12 overflow-y-auto scrollbar-none ${isLtr ? 'dir-ltr' : 'dir-rtl'}`}
		>
			{value || '-'}
		</span>
	</div>
)
