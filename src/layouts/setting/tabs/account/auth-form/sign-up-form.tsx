import { useState } from 'react'
import { FaSearch, FaShareAlt, FaUsers, FaYoutube } from 'react-icons/fa'
import { FiGift } from 'react-icons/fi'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { ConfirmationModal } from '@/components/modal/confirmation-modal'
import { ItemSelector } from '@/components/item-selector'
import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { type ReferralSource, useSignUp } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'

interface ReferralOption {
	id: ReferralSource
	label: string
	icon: React.ComponentType<{ className?: string }>
}

const referralOptions: ReferralOption[] = [
	{
		id: 'social',
		label: 'شبکه‌های اجتماعی',
		icon: FaShareAlt,
	},
	{
		id: 'youtube',
		label: 'یوتیوب',
		icon: FaYoutube,
	},
	{
		id: 'friends',
		label: 'دوستان',
		icon: FaUsers,
	},
	{
		id: 'search_other',
		label: 'موتور جستجو/غیره',
		icon: FaSearch,
	},
]
export const SignUpForm = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [referralSource, setReferralSource] = useState<ReferralSource | null>(null)
	const [referralCode, setReferralCode] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

	const { login } = useAuth()
	const signUpMutation = useSignUp()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setIsConfirmModalOpen(true)
	}

	const handleConfirm = async () => {
		setIsConfirmModalOpen(false)
		try {
			const response = await signUpMutation.mutateAsync({
				name,
				email,
				password,
				referralSource,
				referralCode: referralCode || undefined,
			})
			login(response.data)
			Analytics.event('sign_up')
		} catch (err) {
			const content = translateError(err)
			let errorContent = ''
			if (typeof content === 'string') {
				errorContent = content
			} else {
				if (Object.keys(content).length === 0) {
					errorContent = 'خطا در ورود. لطفاً دوباره تلاش کنید.'
					return
				}
				errorContent = `${Object.keys(content)[0]}: ${Object.values(content)[0]}`
			}

			setError(errorContent)
			showToast(errorContent, 'error')
		}
	}

	const onEditButtonClick = () => {
		setIsConfirmModalOpen(false)
		Analytics.event('sign_up_edit_email')
	}

	return (
		<div className="flex flex-col w-full h-full">
			<form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
				<div className="flex flex-row flex-wrap justify-between gap-1">
					<div className="flex flex-col flex-1 gap-1">
						<label className="flex text-sm font-medium text-muted">نام</label>
						<TextInput
							id="name"
							type="text"
							value={name}
							onChange={setName}
							placeholder="نام کامل خود را وارد کنید"
							disabled={signUpMutation.isPending}
						/>
					</div>

					<div className="flex flex-col flex-1 gap-1">
						<label className="flex text-sm font-medium text-muted">
							ایمیل
						</label>
						<TextInput
							id="email"
							type="email"
							value={email}
							onChange={setEmail}
							placeholder="example@email.com"
							disabled={signUpMutation.isPending}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<label className="flex text-sm font-medium text-muted">
						رمز عبور
					</label>
					<TextInput
						id="password"
						type="password"
						value={password}
						onChange={setPassword}
						placeholder="••••••••"
						disabled={signUpMutation.isPending}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex gap-0.5 items-center text-sm font-medium text-muted">
						<div className="flex items-center justify-center w-5 h-5 ml-0.5 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
							<FiGift size={12} className="text-accent" />
						</div>
						کد دعوت
						<span className="text-xs font-medium text-muted">
							( اختیاری )
						</span>
					</div>
					<TextInput
						id="referralCode"
						type="text"
						value={referralCode}
						onChange={setReferralCode}
						placeholder="کد دعوت را وارد کنید"
						disabled={signUpMutation.isPending}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className="flex text-sm font-medium text-muted">
						چطور ما رو پیدا کردید؟{' '}
						<span className="text-xs font-medium text-muted mr-0.5">
							( اختیاری )
						</span>
					</label>
					<div className="flex flex-col flex-wrap gap-1 sm:grid sm:grid-cols-2">
						{referralOptions.map((option) => (
							<ItemSelector
								key={option.id}
								isActive={referralSource === option.id}
								onClick={() => setReferralSource(option.id)}
								label={
									<div className="flex items-center justify-start w-full gap-2.5 text-base-content/80">
										<div className="flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5">
											<option.icon className="w-3 h-3 text-primary" />
										</div>
										<span className="flex-1 text-sm font-medium text-right">
											{option.label}
										</span>
									</div>
								}
								className="!p-3 flex-1 min-w-0 sm:min-w-[120px]"
							/>
						))}
					</div>
				</div>

				<div className="flex items-center justify-center w-full pt-2">
					<Button
						type="submit"
						disabled={signUpMutation.isPending}
						isPrimary={true}
						size="md"
						className="flex items-center justify-center px-20 py-2.5 text-white cursor-pointer transition-colors rounded-2xl font-medium shadow-none w-60"
					>
						{signUpMutation.isPending ? 'درحال پردازش...' : 'ثبت‌نام'}
					</Button>
				</div>
			</form>

			{error && (
				<div className="p-3 mt-4 border rounded-lg bg-error/20 text-error border-error/30">
					<span className="text-center">{error}</span>
				</div>
			)}

			<ConfirmationModal
				isOpen={isConfirmModalOpen}
				onClose={onEditButtonClick}
				onConfirm={handleConfirm}
				title="آیا از ثبت‌نام با این ایمیل اطمینان دارید؟"
				message={
					<div className="w-full p-3 text-center border bg-content border-content rounded-2xl">
						<strong className="font-sans font-medium text-primary">
							{email}
						</strong>
					</div>
				}
				confirmText="ادامه"
				cancelText="ویرایش"
				variant="info"
				isLoading={signUpMutation.isPending}
				direction="rtl"
			/>
		</div>
	)
}
