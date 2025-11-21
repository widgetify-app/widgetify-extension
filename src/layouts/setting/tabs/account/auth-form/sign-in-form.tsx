import { useState } from 'react'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { useSignIn } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'

interface SignInFormProps {
	onSwitchToSignUp: () => void
}

export const SignInForm = ({ onSwitchToSignUp }: SignInFormProps) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)

	const { login } = useAuth()
	const signInMutation = useSignIn()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		try {
			const response = await signInMutation.mutateAsync({ email, password })
			login(response.data)
			Analytics.event('sign_in')
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
			<form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
				<div className="flex flex-col gap-1">
					<label className="flex text-sm font-medium text-muted">ایمیل</label>
					<TextInput
						id="email"
						type="email"
						value={email}
						onChange={setEmail}
						placeholder="example@email.com"
						disabled={signInMutation.isPending}
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
						disabled={signInMutation.isPending}
					/>
					<div className="flex justify-start">
						<a
							href="https://widgetify.ir/forgot-password"
							target="_blank"
							rel="noopener noreferrer"
							className="flex text-sm font-light transition-colors cursor-pointer text-primary hover:text-primary/80 hover:underline"
						>
							رمز عبور خود را فراموش کرده‌اید؟
						</a>
					</div>
				</div>

				<div className="flex items-center justify-center w-full pt-2">
					<Button
						type="submit"
						disabled={signInMutation.isPending}
						isPrimary={true}
						size="md"
						className="flex items-center justify-center px-20 py-2.5 text-white cursor-pointer transition-colors rounded-2xl font-medium shadow-none min-w-[200px]"
					>
						{signInMutation.isPending ? 'درحال پردازش...' : 'ورود به حساب'}
					</Button>
				</div>
			</form>
			{error && (
				<div className="p-3 mt-4 border rounded-lg bg-error/20 text-error border-error/30">
					<span className="text-center">{error}</span>
				</div>
			)}
			<div className="flex items-center justify-center w-full mt-4">
				<p className="flex items-center gap-1 text-sm text-muted">
					<span>حساب کاربری ندارید؟</span>
					<button
						onClick={onSwitchToSignUp}
						className="flex font-medium transition-colors text-primary hover:text-primary/80 hover:underline"
					>
						ثبت‌نام کنید
					</button>
				</p>
			</div>
		</div>
	)
}
