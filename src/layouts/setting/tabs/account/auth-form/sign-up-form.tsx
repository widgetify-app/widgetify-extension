import { useState } from 'react'
import { FaSearch, FaShareAlt, FaUsers, FaYoutube } from 'react-icons/fa'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { ItemSelector } from '@/components/item-selector'
import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { type ReferralSource, useSignUp } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'

interface ReferralOption {
	id: ReferralSource
	label: string
	icon: React.ComponentType<{ className?: string }>
}

interface SignUpFormProps {
	onSwitchToSignIn: () => void
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
export const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [referralSource, setReferralSource] = useState<ReferralSource | null>(null)
	const [error, setError] = useState<string | null>(null)

	const { login } = useAuth()
	const signUpMutation = useSignUp()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		try {
			const response = await signUpMutation.mutateAsync({
				name,
				email,
				password,
				referralSource,
			})
			login(response.data)

			Analytics.event('sign_up')
		} catch (err) {
			const content = translateError(err)
			if (typeof content === 'string') {
				setError(content)
			} else {
				if (Object.keys(content).length === 0) {
					setError('خطا در احراز هویت. لطفاً دوباره تلاش کنید.')
					return
				}
				setError(`${Object.keys(content)[0]}: ${Object.values(content)[0]}`)
			}
		}
	}

	return (
		<div className="flex flex-col w-full h-full">
			{error && (
				<div className="flex items-center justify-center p-3 mb-4 text-sm text-white rounded-lg bg-error">
					<span className="text-center">{error}</span>
				</div>
			)}

			<form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
				<div className="flex flex-col gap-1">
					<label className="flex text-sm font-medium text-muted">نام</label>
					<TextInput
						id="name"
						type="text"
						value={name}
						onChange={setName}
						placeholder="نام خود را وارد کنید"
						disabled={signUpMutation.isPending}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="flex text-sm font-medium text-muted">ایمیل</label>
					<TextInput
						id="email"
						type="email"
						value={email}
						onChange={setEmail}
						placeholder="example@email.com"
						disabled={signUpMutation.isPending}
					/>
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

				<div className="flex flex-col gap-2">
					<label className="flex text-sm font-medium text-muted">
						چطور ما رو پیدا کردید؟ ( اختیاری )
					</label>
					<div className="flex flex-wrap gap-1 sm:grid sm:grid-cols-2">
						{referralOptions.map((option) => (
							<ItemSelector
								key={option.id}
								isActive={referralSource === option.id}
								onClick={() => setReferralSource(option.id)}
								label={
									<div className="flex items-center justify-start w-full gap-2">
										<option.icon className="flex-shrink-0 w-4 h-4" />
										<span className="flex-1 text-right">
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
						className="flex items-center justify-center px-20 py-2.5 text-white cursor-pointer transition-colors rounded-xl font-medium shadow-none min-w-[200px]"
					>
						{signUpMutation.isPending ? 'درحال پردازش...' : 'ثبت‌نام'}
					</Button>
				</div>
			</form>

			<div className="flex items-center justify-center w-full mt-4">
				<p className="flex items-center gap-1 text-sm text-muted">
					<span>حساب کاربری دارید؟</span>
					<button
						onClick={onSwitchToSignIn}
						className="flex font-medium transition-colors text-primary hover:text-primary/80 hover:underline"
					>
						وارد شوید
					</button>
				</p>
			</div>
		</div>
	)
}
