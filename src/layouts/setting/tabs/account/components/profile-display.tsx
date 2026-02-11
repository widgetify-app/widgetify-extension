import moment from 'jalali-moment'
import { BsGenderAmbiguous } from 'react-icons/bs'
import { FiCalendar, FiMail, FiPhone, FiUser } from 'react-icons/fi'
import { LuAtSign, LuBriefcase, LuCamera, LuHeart } from 'react-icons/lu'
import { AvatarComponent } from '@/components/avatar.component'
import { Button } from '@/components/button/button'
import { OfflineIndicator } from '@/components/offline-indicator'
import { UserCoin } from './user-coin'
import type React from 'react'
import { Chip } from '@/components/chip.component'
import { AddPhoneModal } from './modals/add-phone.modal'
import { useAuth } from '@/context/auth.context'
import { IoMdAddCircle } from 'react-icons/io'
import Analytics from '@/analytics'
import { FaTreeCity } from 'react-icons/fa6'
import { TbEdit } from 'react-icons/tb'
import { ChangeGenderModal } from './modals/edit-gender'
import { ChangeBirthdayModal } from './modals/edit-birthday'
import { ChangeOccupationModal } from './modals/edit-occupation'
import { ChangeInterestsModal } from './modals/edit-interests'
import { ChangeNameModal } from './modals/edit-name'
import { ChangeCityModal } from './modals/edit-city'
import { EditAvatarModal } from './modals/edit.avatar'
import { AddEmailModal } from './modals/add-email.modal'
import { ChangeUsernameModal } from './modals/edit-username'

const getGenderInfo = (gender: 'MALE' | 'FEMALE' | 'OTHER' | null | undefined) => {
	if (gender === 'MALE') return { label: 'آقا هستم' }
	if (gender === 'FEMALE') return { label: 'خانم هستم' }
	return { label: 'بماند' }
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

export const ProfileDisplay = () => {
	const { refetchUser, user } = useAuth()
	const [showModal, setShowModal] = useState(false)
	const [showAvatar, setShowAvatar] = useState(false)
	const genderInfo = getGenderInfo(user?.gender)

	const showEditBadge = (field: string) => {
		if (!user?.progressbar) return false
		return (
			user.progressbar.findIndex((f) => f.field === field && f.isDone === true) < 0
		)
	}

	const onCloseModal = () => {
		setShowModal(false)
		refetchUser()
		Analytics.event('close_add_phone_modal')
	}

	const clickToShow = () => {
		setShowModal(true)
		Analytics.event('open_add_phone_modal')
	}

	const onClick = () => {
		setShowAvatar(true)
		Analytics.event('edit_avatar_opened')
	}

	return (
		<div className="flex flex-col space-y-4">
			<div className="relative flex flex-row items-center justify-between p-2 overflow-hidden border bg-base-100/50 border-content rounded-3xl">
				<div className="flex items-center">
					<div className="relative group">
						<div className="rounded-full shadow-lg">
							<AvatarComponent
								url={user?.avatar || ''}
								placeholder={user?.name || 'کاربر'}
								size="xl"
								onClick={() => onClick()}
								className="transition-all cursor-pointer ring-4 ring-primary/20"
							/>
						</div>
						<button
							type="button"
							onClick={() => onClick()}
							className="absolute p-0.5 cursor-pointer text-white transition-all rounded-full shadow-xl -bottom-1 right-1 bg-primary hover:scale-110 active:scale-95"
						>
							<LuCamera size={12} />
						</button>
					</div>
					<div className="flex flex-col gap-2 mr-2">
						<h2 className="text-xl font-bold text-content">
							{user?.name || 'کاربر'}
						</h2>
						<p className="text-sm opacity-60" dir="ltr">
							@{user?.username || '-'}
						</p>
					</div>
				</div>
				<div className="flex flex-col items-end gap-2">
					<div className="mt-1 itece">
						<UserCoin coins={user?.coins || 0} />
					</div>
					<div className="text-xs font-medium opacity-70 mb-0.5">
						<span>
							شروعِ ماجرا از{' '}
							{moment(user?.joinedAt).locale('fa').format('jMMMM jYYYY')}
						</span>
					</div>
				</div>
			</div>

			<div className="overflow-hidden border border-base-300/50 rounded-2xl bg-base-100/30">
				<DisplayRow
					icon={<FiUser className="text-primary" />}
					label="نام و نام خانوادگی"
					value={user?.name}
					editable
					EditModal={ChangeNameModal}
					modalValue={user?.name}
					refetchDataFunc={refetchUser}
				/>

				<DisplayRow
					icon={<LuAtSign className="text-primary/60" />}
					label="نام کاربری (یوزرنیم)"
					value={user?.username}
					editable
					showBadge={showEditBadge('username')}
					EditModal={ChangeUsernameModal}
					modalValue={user?.username}
					refetchDataFunc={refetchUser}
				/>

				<DisplayRow
					icon={<FiMail className="text-secondary" />}
					label="ایمیل"
					value={user?.email}
					isLtr
					showBadge={showEditBadge('email')}
					editable={showEditBadge('email')}
					EditModal={AddEmailModal}
					refetchDataFunc={refetchUser}
				/>

				<DisplayRow
					icon={<FiPhone className="text-secondary" />}
					label="شماره موبایل"
					value={
						user?.phone ? (
							user.phone
						) : (
							<Button
								size="xs"
								className="rounded-2xl"
								onClick={() => clickToShow()}
							>
								<div className="flex items-center gap-1">
									<IoMdAddCircle />
									افزودن شماره موبایل
								</div>
							</Button>
						)
					}
					isLtr
					showBadge={showEditBadge('phone')}
				/>

				<DisplayRow
					icon={
						<div className="text-accent">
							<BsGenderAmbiguous />
						</div>
					}
					label="جنسیت"
					value={genderInfo.label}
					editable
					EditModal={ChangeGenderModal}
					modalValue={user?.gender}
					refetchDataFunc={refetchUser}
					showBadge={showEditBadge('gender')}
				/>

				<DisplayRow
					icon={<FiCalendar className="text-warning" />}
					label="تاریخ تولد"
					value={formatJalaliDate(user?.birthDate)}
					showBadge={showEditBadge('birthDate')}
					modalValue={user?.birthDate}
					editable={user?.isBirthDateEditable}
					EditModal={ChangeBirthdayModal}
					refetchDataFunc={refetchUser}
				/>

				<DisplayRow
					icon={<LuBriefcase className="text-info" />}
					label="شغل"
					value={user?.occupation?.label}
					showBadge={showEditBadge('occupation')}
					EditModal={ChangeOccupationModal}
					editable
					modalValue={user?.occupation}
					refetchDataFunc={refetchUser}
				/>

				<DisplayRow
					icon={<LuHeart className="text-error" />}
					label="علایق"
					editable
					value={
						<div className="flex flex-wrap self-end justify-end flex-1 gap-1">
							{user?.interests?.map((i) => (
								<Chip
									onClick={() => {}}
									selected={true}
									key={i.id}
									className="p-0! px-0.5! h-6"
								>
									{i.label}
								</Chip>
							))}
						</div>
					}
					EditModal={ChangeInterestsModal}
					modalValue={user?.interests || []}
					refetchDataFunc={refetchUser}
					showBadge={showEditBadge('interests')}
				/>

				<DisplayRow
					icon={<FaTreeCity className="text-primary/50" />}
					label="شهر"
					value={user?.city?.name || '-'}
					showBadge={showEditBadge('city')}
					editable
					EditModal={ChangeCityModal}
					modalValue={user?.city}
					refetchDataFunc={refetchUser}
				/>
			</div>

			{user?.inCache && (
				<div className="pt-2">
					<OfflineIndicator mode="notification" />
				</div>
			)}
			{showAvatar && (
				<EditAvatarModal onClose={() => setShowAvatar(false)} show={true} />
			)}

			<AddPhoneModal isOpen={showModal} onClose={() => onCloseModal()} />
		</div>
	)
}

const DisplayRow = ({
	icon,
	label,
	value,
	isLtr = false,
	showBadge,
	editable,
	EditModal,
	refetchDataFunc,
	modalValue,
}: {
	icon?: React.ReactNode
	label: string
	value?: React.ReactNode
	isLtr?: boolean
	showBadge?: boolean
	editable?: boolean
	EditModal?: React.ComponentType<{
		show: boolean
		onClose: (t: any) => void
		currentValue?: string
	}>
	modalValue?: any
	refetchDataFunc?: any
}) => {
	const [show, setShow] = useState(false)
	const onClickEdit = () => {
		setShow(true)
	}

	const onClose = (type: 'success' | 'cancel') => {
		if (type === 'success') {
			refetchDataFunc?.()
		}

		setShow(false)
	}

	return (
		<div className="flex items-center justify-between p-2 transition-colors border-b last:border-b-0 border-base-300/30 hover:bg-base-200/20">
			<div className="flex items-center gap-3">
				<div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-base-200/50">
					{icon}
					{showBadge && (
						<span className="absolute w-2 h-2 rounded-full left-0.5 -top-0.5 bg-error animate-pulse"></span>
					)}
				</div>
				<span className="text-[10px] font-medium opacity-60">{label}</span>
			</div>
			<div
				className={`relative flex justify-end text-xs w-fit pr-1 font-semibold text-content ${isLtr ? 'dir-ltr' : 'dir-rtl'}`}
			>
				<div className="overflow-y-auto max-h-12 scrollbar-none">
					{value || '-'}
				</div>
				{editable && (
					<div
						className="absolute p-1 -translate-y-1/2 cursor-pointer text-muted -right-4 top-1/2 active:scale-95"
						onClick={onClickEdit}
					>
						<TbEdit />
					</div>
				)}
			</div>

			{editable && EditModal && show && (
				<EditModal
					show={true}
					onClose={(type: any) => onClose(type)}
					currentValue={modalValue}
				/>
			)}
		</div>
	)
}
