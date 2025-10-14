import type { AxiosError } from 'axios'
import moment from 'jalali-moment'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { AvatarComponent } from '@/components/avatar.component'
import { Button } from '@/components/button/button'
import { ItemSelector } from '@/components/item-selector'
import { TextInput } from '@/components/text-input'
import { safeAwait } from '@/services/api'
import {
	useUpdateUsername,
	useUpdateUserProfile,
} from '@/services/hooks/auth/authService.hook'
import type { UserProfile } from '@/services/hooks/user/userService.hook'
import { translateError } from '@/utils/translate-error'
import JalaliDatePicker from './components/ProfileDatePicker'

interface ProfileEditFormProps {
	profile?: UserProfile
	onCancel: () => void
	onSuccess: () => void
}

export const ProfileEditForm = ({
	profile,
	onCancel,
	onSuccess,
}: ProfileEditFormProps) => {
	const [formData, setFormData] = useState({
		name: '',
		gender: '' as 'MALE' | 'FEMALE' | 'OTHER' | '',
		birthdate: '',
		avatar: null as File | null,
		username: null as string | null,
	})
	const [error, setError] = useState<string | null>(null)

	const updateProfileMutation = useUpdateUserProfile()
	const updateUsernameMutation = useUpdateUsername()

	const avatarRef = useRef<HTMLInputElement | null>(null)
	useEffect(() => {
		setFormData({
			name: profile?.name || '',
			gender: profile?.gender || '',
			birthdate: profile?.birthDate || '',
			avatar: null,
			username: profile?.username || null,
		})
	}, [profile])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const data = new FormData()
		data.append('name', formData.name)

		if (formData.gender) data.append('gender', formData.gender)
		if (formData.birthdate) {
			const gregorianDate = moment(formData.birthdate, 'jYYYY-jMM-jDD')
				.doAsGregorian()
				.format('YYYY-MM-DD')
			data.append('birthdate', gregorianDate)
		}
		if (formData.avatar) data.append('avatar', formData.avatar)

		try {
			if (formData.username && formData.username !== profile?.username) {
				const usernameRegex = /^[a-zA-Z0-9_]{4,250}$/
				if (!usernameRegex.test(formData.username)) {
					setError(
						'نام کاربری باید فقط شامل حروف انگلیسی، اعداد و زیرخط باشد و بین 4 تا 250 کاراکتر باشد.'
					)
					return
				}

				const [err, response] = await safeAwait<AxiosError, UserProfile>(
					updateUsernameMutation.mutateAsync(formData.username)
				)
				if (err) {
					errorHandling(err, setError)
					return
				} else {
					setFormData((prev) => ({
						...prev,
						username: response.username || '',
					}))
				}
			}

			await updateProfileMutation.mutateAsync(data)
			setError(null)
			onSuccess()
		} catch (error: any) {
			errorHandling(error, setError)
		}
	}

	const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file && file.size > 1024 * 1024) {
			toast.error('فایل باید کمتر از 1 مگابایت باشد')
			return
		}

		const validTypes = ['image/png', 'image/jpeg', 'image/webp']
		if (file && !validTypes.includes(file.type)) {
			toast.error('فقط فرمت‌های png، jpeg و webp مجاز هستند', {
				duration: 4000,
			})
			return
		}

		setFormData((prev) => ({
			...prev,
			avatar: file || null,
		}))
	}

	const onChangeGender = (gender: 'MALE' | 'FEMALE' | 'OTHER') => {
		setFormData((prev) => ({
			...prev,
			gender,
		}))
	}

	const onChangeBirthdate = (date: any) => {
		setFormData((prev) => ({
			...prev,
			birthdate: date,
		}))
	}

	return (
		<div className="relative mb-2 border border-content rounded-2xl">
			<div className="relative p-4">
				{error && (
					<div className="p-3 mb-4 border rounded-lg border-error/20 bg-error/10">
						<p className="text-sm text-error">{error}</p>
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex flex-row justify-around w-full gap-2">
						<div className="w-full">
							<label className="block text-sm font-medium text-content mb-0.5">
								نام
							</label>
							<TextInput
								type="text"
								value={formData.name}
								placeholder="نام کامل"
								onChange={(value) =>
									setFormData((prev) => ({
										...prev,
										name: value,
									}))
								}
								className="w-full"
							/>
						</div>
						<div className="w-full">
							<label className="block text-sm font-medium text-content mb-0.5">
								نام کاربری{' '}
								<span className="text-xs text-muted">( انگلیسی )</span>
							</label>
							<TextInput
								type="text"
								value={formData.username || ''}
								placeholder="به عنوان مثال: mr_musk"
								onChange={(value) =>
									setFormData((prev) => ({
										...prev,
										username: value,
									}))
								}
								className="w-full px-2"
							/>
						</div>
					</div>
					<div>
						<JalaliDatePicker
							id="birthdate"
							label="تاریخ تولد"
							value={formData.birthdate}
							disabled={!profile?.isBirthDateEditable}
							onChange={(val) => onChangeBirthdate(val)}
						/>
						{!profile?.isBirthDateEditable && (
							<p className="mt-1 text-xs text-muted bg-content w-fit py-0.5 px-1 rounded-2xl">
								تاریخ تولد شما به تازگی ویرایش شده، کمی صبر کنید.
							</p>
						)}
					</div>
					<div className="w-full">
						<label className="block text-sm font-medium text-content mb-0.5">
							جنسیت
						</label>
						<div className="flex w-full gap-2">
							<ItemSelector
								isActive={formData.gender === 'MALE'}
								label="مذکر"
								className="w-full"
								onClick={() => onChangeGender('MALE')}
							/>
							<ItemSelector
								isActive={formData.gender === 'FEMALE'}
								label="مؤنث"
								className="w-full"
								onClick={() => onChangeGender('FEMALE')}
							/>
							<ItemSelector
								isActive={formData.gender === 'OTHER'}
								label="غیره"
								className="w-full"
								onClick={() => onChangeGender('OTHER')}
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-content mb-0.5">
							نمایه
						</label>
						<input
							type="file"
							ref={avatarRef}
							accept="image/jpeg,image/png"
							onChange={onChangeAvatar}
							className="hidden"
						/>
						<AvatarComponent
							url={profile?.avatar || null}
							file={formData.avatar}
							placeholder={profile?.name || 'کاربر'}
							size="xl"
							className="relative border-4 shadow-2xl cursor-pointer border-white/20 backdrop-blur-sm hover:bg-white/10 hover:filter hover:brightness-110"
							onClick={() => {
								avatarRef.current?.click()
							}}
						/>
					</div>
					<div className="flex gap-2">
						<Button
							type="submit"
							disabled={updateProfileMutation.isPending}
							className="px-4 py-2 text-white rounded-lg bg-primary"
							size="sm"
						>
							{updateProfileMutation.isPending
								? 'در حال ذخیره...'
								: 'ذخیره'}
						</Button>
						<Button
							type="button"
							onClick={onCancel}
							className="px-4 py-2 border rounded-lg text-content bg-background border-content"
							size="sm"
						>
							لغو
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

function errorHandling(err: AxiosError, setError: any) {
	if (err.response) {
		const translate: string | Record<string, string> = translateError(err)
		if (typeof translate === 'string') {
			setError(translate)
		} else {
			const keys = Object.keys(translate)
			const messages: Array<string> = []
			keys.forEach((key) => {
				messages.push(`${key}: ${translate[key]}`)
			})
			setError(messages.join('\n'))
		}
	}
}
