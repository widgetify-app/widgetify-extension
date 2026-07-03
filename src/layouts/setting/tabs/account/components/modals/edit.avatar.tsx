import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { AvatarComponent } from '@/components/avatar.component'
import Modal from '@/components/modal'
import { SectionPanel } from '@/components/section-panel'
import { useAuth } from '@/context/auth.context'
import { useUpdateUserProfile } from '@/services/hooks/auth/authService.hook'
import { useRef, useState } from 'react'
import { FooterButtons } from './footer-buttons'
import { Icon } from '@/src/icons'

interface Prop {
	show: boolean
	onClose: () => void
}
export function EditAvatarModal({ show, onClose }: Prop) {
	const { refetchUser } = useAuth()
	const [avatar, setAvatar] = useState<File | null>(null)
	const avatarRef = useRef<HTMLInputElement | null>(null)
	const updateProfileMutation = useUpdateUserProfile()

	const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file && file.size > 1024 * 1024) {
			showToast('فایل بزرگتر از ۱ مگابایت است', 'error')
			return
		}
		const validTypes = ['image/png', 'image/jpeg', 'image/webp']
		if (file && !validTypes.includes(file.type)) {
			showToast('فرمت فایل نامعتبر است', 'error')
			return
		}
		setAvatar(file || null)
	}

	const onSave = async () => {
		const data = new FormData()
		if (avatar) data.append('avatar', avatar)

		await updateProfileMutation.mutateAsync(data)
		await refetchUser()
		Analytics.event('avatar_updated')
		setTimeout(() => {
			onClose()
		}, 10)
	}

	return (
		<Modal
			isOpen={show}
			onClose={() => onClose}
			title=" "
			direction="rtl"
			showCloseButton={false}
		>
			<div className="flex flex-col justify-between w-full h-52">
				<SectionPanel title="تغییر آواتار" size="xs">
					<div
						className="flex items-center justify-center mx-auto mt-8 transition-all duration-200 ease-out border border-dashed rounded-full cursor-pointer active:scale-95 text-muted h-14 w-14 border-base-content/70 hover:scale-95"
						onClick={() => avatarRef.current?.click()}
					>
						{avatar ? (
							<AvatarComponent
								file={avatar}
								size="lg"
								className="transition-all cursor-pointer ring-4 ring-primary/5"
							/>
						) : (
							<Icon name="cameraPlus" />
						)}
					</div>

					<input
						type="file"
						ref={avatarRef}
						accept="image/*"
						onChange={onChangeAvatar}
						className="hidden"
					/>
				</SectionPanel>

				<FooterButtons
					handleConfirm={onSave}
					handleCancel={onClose}
					isPending={updateProfileMutation.isPending}
				/>
			</div>
		</Modal>
	)
}
