import moment from 'jalali-moment'
import { Button } from '@/components/ui'
import { OfflineIndicator } from '@/components/ui'
import { ProfileHeader } from './profile-header'
import type React from 'react'
import { Chip } from '@/components/ui'
import { AddPhoneModal } from './modals/add-phone.modal'
import { useAuth } from '@/context/auth.context'
import Analytics from '@/analytics'
import { ChangeGenderModal } from './modals/edit-gender'
import { ChangeBirthdayModal } from './modals/edit-birthday'
import { ChangeOccupationModal } from './modals/edit-occupation'
import { ChangeInterestsModal } from './modals/edit-interests'
import { ChangeNameModal } from './modals/edit-name'
import { ChangeCityModal } from './modals/edit-city'
import { AddEmailModal } from './modals/add-email.modal'
import { ChangeUsernameModal } from './modals/edit-username'
import { AvatarCropModal } from './modals/avatar/avatar-crop.modal'
import { GalleryPickerModal } from '@/components/gallery/gallery-picker-modal'
import type { GalleryAsset } from '@/services/hooks/gallery/get-gallery-assets.hook'
import { useUpdateUserProfile } from '@/services/hooks/auth/auth-service.hook'
import { showToast } from '@/common/toast'
import { Icon } from '@/src/icons'
import { useState } from 'react'

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
	const [showGallery, setShowGallery] = useState(false)
	const [cropImage, setCropImage] = useState<string | null>(null)
	const updateProfileMutation = useUpdateUserProfile()
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

	const handleUploadFile = (file: File) => {
		if (file.size > 2 * 1024 * 1024) {
			showToast('فایل بزرگتر از ۲ مگابایت است', 'error')
			return
		}
		const validTypes = ['image/png', 'image/jpeg', 'image/webp']
		if (!validTypes.includes(file.type)) {
			showToast('فرمت فایل نامعتبر است', 'error')
			return
		}
		setCropImage(URL.createObjectURL(file))
		Analytics.event('edit_avatar_file_selected')
	}

	const handleCropComplete = async (croppedFile: File) => {
		if (cropImage) {
			URL.revokeObjectURL(cropImage)
			setCropImage(null)
		}
		try {
			const formData = new FormData()
			formData.append('avatar', croppedFile)
			await updateProfileMutation.mutateAsync(formData)
			await refetchUser()
			showToast('آواتار با موفقیت تغییر کرد', 'success')
			Analytics.event('avatar_updated')
		} catch {
			showToast('خطا در بارگذاری تصویر', 'error')
		}
	}

	const handleCropCancel = () => {
		if (cropImage) {
			URL.revokeObjectURL(cropImage)
			setCropImage(null)
		}
	}

	const onSelectAvatarAsset = async (asset: GalleryAsset) => {
		setShowGallery(false)
		try {
			const formData = new FormData()
			formData.append('avatarKey', asset.id)
			await updateProfileMutation.mutateAsync(formData)
			await refetchUser()
			showToast('آواتار با موفقیت تغییر کرد', 'success')
			Analytics.event('avatar_updated_from_gallery')
		} catch {
			showToast('خطا در تغییر آواتار', 'error')
		}
	}

	return (
		<div className="flex flex-col space-y-4">
			<ProfileHeader
				onUploadFile={handleUploadFile}
				onSelectFromGallery={() => {
					setShowGallery(true)
					Analytics.event('gallery_avatar_opened')
				}}
				showEditBadge={showEditBadge}
			/>

			<div className="overflow-hidden border border-base-300/50 rounded-2xl bg-base-100/30">
				<DisplayRow
					icon={<Icon name="user" className="text-primary" />}
					label="نام و نام خانوادگی"
					value={user?.name}
					editable
					EditModal={ChangeNameModal}
					modalValue={user?.name}
					refetchDataFunc={refetchUser}
				/>

				<DisplayRow
					icon={<Icon name="atSign" className="text-primary/60" />}
					label="نام کاربری (یوزرنیم)"
					value={user?.username}
					editable
					showBadge={showEditBadge('username')}
					EditModal={ChangeUsernameModal}
					modalValue={user?.username}
					refetchDataFunc={refetchUser}
				/>

				<DisplayRow
					icon={<Icon name="mail" className="text-secondary" />}
					label="ایمیل"
					value={user?.email}
					isLtr
					showBadge={showEditBadge('email')}
					editable={showEditBadge('email')}
					EditModal={AddEmailModal}
					refetchDataFunc={refetchUser}
				/>

				<DisplayRow
					icon={<Icon name="phone" className="text-secondary" />}
					label="شماره موبایل"
					value={
						user?.phone ? (
							user.phone
						) : (
							<Button
								size="xs"
								rounded={'2xl'}
								onClick={() => clickToShow()}
							>
								<div className="flex items-center gap-1">
									<Icon name="outlineAddCircle" />
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
							<Icon name="gender" />
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
					icon={<Icon name="calendar" className="text-warning" />}
					label="تاریخ تولد"
					value={formatJalaliDate(user?.birthDate)}
					showBadge={showEditBadge('birthDate')}
					modalValue={user?.birthDate}
					editable={user?.isBirthDateEditable}
					EditModal={ChangeBirthdayModal}
					refetchDataFunc={refetchUser}
				/>

				<DisplayRow
					icon={<Icon name="briefcase" className="text-info" />}
					label="شغل"
					value={user?.occupation?.label}
					showBadge={showEditBadge('occupation')}
					EditModal={ChangeOccupationModal}
					editable
					modalValue={user?.occupation}
					refetchDataFunc={refetchUser}
				/>

				<DisplayRow
					icon={<Icon name="outlineHeart" className="text-error" />}
					label="علایق"
					editable
					value={
						<div className="flex flex-wrap self-end justify-end flex-1 gap-1 overflow-y-auto w-42 sm:w-72">
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
					icon={<Icon name="treeCity" className="text-primary/50" />}
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
			{cropImage && (
				<AvatarCropModal
					show={true}
					image={cropImage}
					onClose={handleCropCancel}
					onCropComplete={handleCropComplete}
				/>
			)}

			<GalleryPickerModal
				isOpen={showGallery}
				onClose={() => setShowGallery(false)}
				type="AVATAR"
				title="گالری آواتارها"
				onSelect={onSelectAvatarAsset}
			/>

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
						<Icon name="edit" />
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
