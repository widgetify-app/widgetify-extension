import { Button } from '@/components/button/button'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { useSignIn } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'
import { useState } from 'react'

export const AuthForm = () => {
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

	const handleRedirectToRegister = () => {
		window.open('https://widgetify.ir/register', '_blank')
	}

	return (
		<SectionPanel title="ورود به حساب کاربری" delay={0.1}>
			{error && (
				<div className="p-3 mb-4 text-sm text-white rounded-lg bg-error">
					{error}
				</div>
			)}
			<div className="py-10 flex flex-col justify-center max-w-md mx-auto">
				<form onSubmit={handleSubmit} className="w-full space-y-5">
					<div className="space-y-1">
						<label className={'block text-sm font-medium text-muted'}>
							ایمیل
						</label>
						<TextInput
							id="email"
							type="email"
							value={email}
							onChange={setEmail}
							placeholder="example@email.com"
							disabled={signInMutation.isPending}
						/>
					</div>

					<div className="space-y-1">
						<label className={'block text-sm font-medium text-muted'}>
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
						<a
							href="https://widgetify.ir/forgot-password"
							target="_blank"
							rel="noopener noreferrer"
							className={
								'block text-left text-sm transition-colors cursor-pointer font-light text-primary hover:text-primary/80 hover:underline'
							}
						>
							رمز عبور خود را فراموش کرده‌اید؟
						</a>
					</div>
					<div className="flex items-center justify-center mt-2">
						<Button
							type="submit"
							disabled={signInMutation.isPending}
							isPrimary={true}
							size="md"
							className="px-20 py-2.5 text-white cursor-pointer transition-colors rounded-xl font-medium shadow-none"
						>
							{signInMutation.isPending
								? 'درحال پردازش...'
								: 'ورود به حساب'}
						</Button>
					</div>
				</form>

				<Button
					onClick={() => handleRedirectToRegister()}
					className={
						'btn-link mt-1 transition-opacity duration-200 text-primary font-normal'
					}
					size="md"
				>
					حساب کاربری ندارید؟ ثبت‌نام کنید
				</Button>
			</div>
		</SectionPanel>
	)
}
