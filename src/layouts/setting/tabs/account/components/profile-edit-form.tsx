import type { AxiosError } from 'axios'
import moment from 'jalali-moment'
import { useEffect, useRef, useState } from 'react'
import { LuCamera, LuUser, LuBriefcase, LuChevronRight } from 'react-icons/lu'
import { AvatarComponent } from '@/components/avatar.component'
import { Button } from '@/components/button/button'
import { TextInput } from '@/components/text-input'
import { OccupationSelector } from '@/layouts/setting/tabs/account/components/occupation-selector'
import { InterestsSelector } from '@/layouts/setting/tabs/account/components/interests-selector'
import { safeAwait } from '@/services/api'
import {
	useUpdateUsername,
	useUpdateUserProfile,
} from '@/services/hooks/auth/authService.hook'
import type { UserProfile } from '@/services/hooks/user/userService.hook'
import {
	useGetOccupations,
	useGetInterests,
} from '@/services/hooks/profile/getProfileMeta.hook'
import { translateError } from '@/utils/translate-error'
import JalaliDatePicker from './profile-date-picker'
import { showToast } from '@/common/toast'
import { SectionPanel } from '@/components/section-panel'
import { FaMars, FaQuestion, FaVenus } from 'react-icons/fa'

interface ProfileEditFormProps {
	profile?: UserProfile
	onCancel: () => void
	onSuccess: () => void
}

const options = {
	MALE: {
		label: 'آقا هستم',
		icon: <FaMars size={14} />,
	},
	FEMALE: {
		label: 'خانم هستم',
		icon: <FaVenus size={14} />,
	},
	OTHER: {
		label: 'بماند',
		icon: <FaQuestion size={14} />,
	},
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
		occupation: null as string | null,
		interests: [] as string[],
	})
	const [error, setError] = useState<string | null>(null)

	const updateProfileMutation = useUpdateUserProfile()
	const updateUsernameMutation = useUpdateUsername()
	const { data: occupations = [], isLoading: occupationsLoading } = useGetOccupations()
	const { data: interests = [], isLoading: interestsLoading } = useGetInterests()
	const avatarRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		setFormData({
			name: profile?.name || '',
			gender: profile?.gender || '',
			birthdate: profile?.birthDate || '',
			avatar: null,
			username: profile?.username || null,
			occupation: profile?.occupation || null,
			interests: profile?.interests || [],
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
		if (formData.occupation) data.append('occupationId', formData.occupation)

		formData.interests.map((id) => data.append('interestIds[]', id))

		try {
			if (formData.username && formData.username !== profile?.username) {
				const usernameRegex = /^[a-zA-Z0-9_]{4,250}$/
				if (!usernameRegex.test(formData.username)) {
					setError('نام کاربری نامعتبر است')
					return
				}
				const [err, _] = await safeAwait<AxiosError, UserProfile>(
					updateUsernameMutation.mutateAsync(formData.username)
				)
				if (err) {
					errorHandling(err, setError)
					return
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
			showToast('فایل بزرگتر از ۱ مگابایت است', 'error')
			return
		}
		const validTypes = ['image/png', 'image/jpeg', 'image/webp']
		if (file && !validTypes.includes(file.type)) {
			showToast('فرمت فایل نامعتبر است', 'error')
			return
		}
		setFormData((prev) => ({ ...prev, avatar: file || null }))
	}

	return (
		<div className="max-w-2xl mx-auto overflow-hidden border shadow-sm border-content rounded-[2.5rem]">
			<div className="relative h-10 bg-linear-to-br from-primary/20 via-secondary/10 to-transparent" />

			<div className="relative px-6 pb-4 -mt-10">
				<div className="flex flex-col items-center mb-4">
					<div className="relative group">
						<div className="p-1.5 rounded-full shadow-lg">
							<AvatarComponent
								url={profile?.avatar || null}
								file={formData.avatar}
								placeholder={profile?.name || 'کاربر'}
								size="xl"
								className="transition-all cursor-pointer ring-4 ring-primary/5 group-hover:brightness-95"
								onClick={() => avatarRef.current?.click()}
							/>
						</div>
						<button
							type="button"
							onClick={() => avatarRef.current?.click()}
							className="absolute p-1 text-white transition-all rounded-full shadow-xl bottom-1 right-1 bg-primary hover:scale-110 active:scale-95"
						>
							<LuCamera size={14} />
						</button>
						<input
							type="file"
							ref={avatarRef}
							accept="image/*"
							onChange={onChangeAvatar}
							className="hidden"
						/>
					</div>
				</div>

				{error && (
					<div className="p-2 mb-2 text-sm font-medium border rounded-2xl border-error/20 bg-error/5 text-error">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<SectionPanel
						title="کی هستی؟"
						icon={<LuUser size={18} className="text-primary" />}
						size="xs"
					>
						<div className="grid grid-cols-1 gap-6 p-1 space-y-2 md:grid-cols-2">
							<div className="space-y-2">
								<label className="px-1 text-xs text-content">
									نام کامل
								</label>
								<TextInput
									value={formData.name}
									placeholder="وارد کنید..."
									onChange={(val) =>
										setFormData((p) => ({ ...p, name: val }))
									}
								/>
							</div>
							<div className="space-y-2">
								<label className="px-1 text-xs text-content">
									نام کاربری (انگلیسی)
								</label>
								<TextInput
									value={formData.username || ''}
									placeholder="example_id"
									onChange={(val) =>
										setFormData((p) => ({ ...p, username: val }))
									}
								/>
							</div>
						</div>

						<div className="space-y-3">
							<label className="px-1 text-xs text-content">جنسیت</label>
							<div className="flex gap-2 p-1.5 bg-content rounded-2xl">
								{(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => {
									const isActive = formData.gender === g

									return (
										<button
											key={g}
											type="button"
											onClick={() =>
												setFormData((p) => ({ ...p, gender: g }))
											}
											className={`flex-1 py-2 px-1 flex flex-col items-center gap-1 text-[10px] font-bold rounded-xl transition-all duration-300 cursor-pointer ${
												isActive
													? 'text-primary shadow-sm ring-1 ring-primary/20 scale-[1.02]'
													: 'text-muted hover:text-content hover:bg-content/5'
											}`}
										>
											<span
												className={
													isActive
														? 'text-primary'
														: 'text-muted/60'
												}
											>
												{options[g].icon}
											</span>
											{options[g].label}
										</button>
									)
								})}
							</div>
						</div>
					</SectionPanel>

					<SectionPanel
						title="علایق و کار و بار"
						icon={<LuBriefcase size={18} className="text-primary" />}
						size="xs"
					>
						<div className="grid grid-cols-1 gap-4 p-1 space-y-2 md:grid-cols-2">
							<div className="space-y-2">
								<label className="px-1 text-sm text-content">
									روز تولدت؟{' '}
									{profile?.isBirthDateEditable === false && (
										<span className="text-[10px] text-error">
											(تازه تغییر کرده، غیرقابل ویرایش)
										</span>
									)}
								</label>
								<JalaliDatePicker
									value={formData.birthdate}
									enable={profile?.isBirthDateEditable || false}
									onChange={(val) =>
										setFormData((p) => ({ ...p, birthdate: val }))
									}
								/>
							</div>

							<div className="space-y-2">
								<label className="px-1 text-sm text-content">
									چه‌کاره‌ای؟
								</label>
								<OccupationSelector
									occupations={occupations}
									selectedOccupation={formData.occupation}
									onSelect={(id) =>
										setFormData((p) => ({ ...p, occupation: id }))
									}
									isLoading={occupationsLoading}
									triggerElement={
										<div className="flex items-center justify-between w-full h-12 p-3 transition-colors border cursor-pointer border-content rounded-xl hover:border-primary/50!">
											<div className="flex items-center gap-3">
												<LuBriefcase
													size={14}
													className="text-primary"
												/>
												<span
													className={`text-sm ${formData.occupation ? 'text-content' : 'text-muted'}`}
												>
													{formData.occupation
														? occupations.find(
																(o) =>
																	o.id ===
																	formData.occupation
															)?.title
														: 'انتخاب شغل'}
												</span>
											</div>
											<LuChevronRight
												size={18}
												className="text-muted"
											/>
										</div>
									}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="px-1 text-xs text-content">
								<span>به چی علاقه داری؟ (3 تا)</span>
							</label>
							<InterestsSelector
								interests={interests}
								selectedInterests={formData.interests}
								onSelect={(ids) =>
									setFormData((p) => ({ ...p, interests: ids }))
								}
								isLoading={interestsLoading}
								triggerElement={
									<div className="flex flex-wrap w-64 gap-2 p-3 transition-all border min-h-14 border-content rounded-2xl hover:border-primary/40! cursor-pointer">
										{formData.interests.length > 0 ? (
											formData.interests.map((id) => (
												<div
													key={id}
													className="flex items-center gap-1 px-2 py-1 text-[11px] bg-primary/10 text-primary rounded-full  border border-primary/20"
												>
													{
														interests.find((i) => i.id === id)
															?.title
													}
												</div>
											))
										) : (
											<span className="text-xs text-muted">
												انتخاب زمینه‌های مورد علاقه...
											</span>
										)}
									</div>
								}
							/>
						</div>
					</SectionPanel>

					<div className="flex gap-4">
						<Button
							size="sm"
							type="submit"
							disabled={updateProfileMutation.isPending}
							isPrimary={true}
							className="flex-[2] h-12 rounded-2xl text-sm  shadow-lg shadow-primary/20"
						>
							{updateProfileMutation.isPending
								? 'در حال ذخیره...'
								: 'بروزرسانی پروفایل'}
						</Button>
						<Button
							size="sm"
							type="button"
							onClick={onCancel}
							className="flex-1 h-12 text-sm font-medium border-none rounded-2xl bg-content"
						>
							انصراف
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

function errorHandling(err: AxiosError, setError: any) {
	if (err.response) {
		const translate = translateError(err)
		setError(
			typeof translate === 'string'
				? translate
				: Object.values(translate).join('\n')
		)
	}
}
