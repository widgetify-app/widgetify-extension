import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { AvatarComponent } from '@/components/avatar.component'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { SectionPanel } from '@/components/section-panel'
import { useAuth } from '@/context/auth.context'
import { useUpdateUserProfile } from '@/services/hooks/auth/authService.hook'
import { useRef, useState } from 'react'
import { TbCameraPlus } from 'react-icons/tb'

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
							<TbCameraPlus />
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
				<div className="flex gap-2 ">
					<Button
						size="sm"
						type="submit"
						disabled={updateProfileMutation.isPending}
						isPrimary={true}
						onClick={() => onSave()}
						className="text-sm shadow-xs flex-2 rounded-xl shadow-primary/20"
					>
						{updateProfileMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
					</Button>
					<Button
						size="sm"
						type="button"
						disabled={updateProfileMutation.isPending}
						onClick={() => onClose()}
						className="flex-1 text-sm font-medium border-none rounded-2xl bg-content"
					>
						انصراف
					</Button>
				</div>
			</div>
		</Modal>
	)
}
