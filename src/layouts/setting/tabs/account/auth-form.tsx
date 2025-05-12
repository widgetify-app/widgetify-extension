import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { getTextColor, useTheme } from '@/context/theme.context'
import { useSignIn } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'
import { motion } from 'framer-motion'
import { useState } from 'react'

export const AuthForm = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)

	const { login } = useAuth()
	const { theme } = useTheme()
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

	const getButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-600 hover:bg-blue-700 text-white'
			case 'dark':
				return 'bg-blue-500 hover:bg-blue-600 text-white'
			default: // glass
				return 'bg-blue-500/70 hover:bg-blue-600/70 backdrop-blur-sm text-white'
		}
	}

	const getToggleButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-600 hover:text-blue-800'
			case 'dark':
				return 'text-blue-400 hover:text-blue-300'
			default: // glass
				return 'text-blue-400 hover:text-blue-300'
		}
	}

	const getErrorStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-red-500 text-white'
			case 'dark':
				return 'bg-red-600 text-white'
			default: // glass
				return 'bg-red-500/70 backdrop-blur-sm text-white'
		}
	}

	const handleRedirectToRegister = () => {
		window.open('https://widgetify.ir/register', '_blank')
	}

	return (
		<motion.div
			className="flex flex-col justify-center max-w-md mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<motion.h2
				className={`mb-5 text-xl font-medium text-center ${getTextColor(theme)}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.1 }}
			>
				ورود به حساب کاربری
			</motion.h2>

			{error && (
				<motion.div
					className={`p-3 mb-6 text-sm rounded-lg ${getErrorStyle()}`}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
				>
					{error}
				</motion.div>
			)}

			<motion.form
				onSubmit={handleSubmit}
				className="w-full space-y-5"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
			>
				<div className="space-y-2">
					<label
						className={`block text-sm font-medium ${getTextColor(theme)} opacity-85`}
					>
						ایمیل
					</label>
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

				<div className="space-y-2">
					<label
						className={`block text-sm font-medium ${getTextColor(theme)} opacity-85`}
					>
						رمز عبور
					</label>
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
						className={`block text-left text-sm transition-colors cursor-pointer font-light ${getToggleButtonStyle()}`}
					>
						رمز عبور خود را فراموش کرده‌اید؟
					</a>
				</div>

				<motion.button
					type="submit"
					className={`w-full py-3 cursor-pointer rounded-xl transition-all duration-200 mt-6 ${getButtonStyle()}`}
					disabled={signInMutation.isPending}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					{signInMutation.isPending ? 'درحال پردازش...' : 'ورود به حساب'}
				</motion.button>
			</motion.form>

			<motion.button
				onClick={handleRedirectToRegister}
				className={`mt-3 text-sm transition-colors cursor-pointer font-light ${getToggleButtonStyle()}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				whileHover={{ scale: 1.05 }}
			>
				حساب کاربری ندارید؟ ثبت‌نام کنید
			</motion.button>
		</motion.div>
	)
}
