import { Button } from '@/components/button/button'
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
		<div className="flex flex-col justify-center max-w-md mx-auto">
			<h2 className={'mb-5 text-xl font-medium text-center text-muted'}>
				ورود به حساب کاربری
			</h2>
			{error && (
				<div className="p-3 mb-4 text-sm bg-red-100 rounded-lg text-error">{error}</div>
			)}
			<form onSubmit={handleSubmit} className="w-full space-y-5">
				<div className="space-y-1">
					<label className={'block text-sm font-medium text-muted'}>ایمیل</label>
					<TextInput
						direction="ltr"
						id="email"
						type="email"
						value={email}
						onChange={setEmail}
						placeholder="example@email.com"
						disabled={signInMutation.isPending}
					/>
				</div>

				<div className="space-y-1">
					<label className={'block text-sm font-medium text-muted'}>رمز عبور</label>
					<TextInput
						direction="ltr"
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
						className="px-5 py-2.5 text-white cursor-pointer transition-colors bg-blue-500 rounded-lg font-medium hover:bg-blue-600 w-3/4"
					>
						{signInMutation.isPending ? 'درحال پردازش...' : 'ورود به حساب'}
					</Button>
				</div>
			</form>

			<Button
				onClick={() => handleRedirectToRegister()}
				className={
					'btn-link mt-4 hover:opacity-60 transition-opacity duration-200 text-primary hover:text-primary/80'
				}
				size="md"
			>
				حساب کاربری ندارید؟ ثبت‌نام کنید
			</Button>
		</div>
	)
}
