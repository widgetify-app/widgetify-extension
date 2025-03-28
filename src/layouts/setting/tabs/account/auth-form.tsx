import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { useTheme } from '@/context/theme.context'
import { useSignIn, useSignUp } from '@/services/getMethodHooks/auth/authService.hook'
import { motion } from 'framer-motion'
import { useState } from 'react'

export const AuthForm = () => {
	const [isLogin, setIsLogin] = useState(true)
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)

	const { login } = useAuth()
	const { theme, themeUtils } = useTheme()
	const signInMutation = useSignIn()
	const signUpMutation = useSignUp()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		try {
			if (isLogin) {
				const response = await signInMutation.mutateAsync({ email, password })
				login(response.data)
			} else {
				const response = await signUpMutation.mutateAsync({
					name,
					password,
					email,
				})
				login(response.data)
			}
		} catch (err) {
			setError('خطا در احراز هویت. لطفاً دوباره تلاش کنید.')
			console.error(err)
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

	return (
		<motion.div
			className="flex flex-col justify-center max-w-md mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<motion.h2
				className={`mb-5 text-xl font-medium text-center ${themeUtils.getTextColor()}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.1 }}
			>
				{isLogin ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری جدید'}
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
				{!isLogin && (
					<motion.div
						className="space-y-2"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
					>
						<label
							className={`block text-sm font-medium ${themeUtils.getTextColor()} opacity-85`}
						>
							نام و نام خانوادگی
						</label>
						<TextInput
							id="name"
							type="text"
							value={name}
							onChange={setName}
							placeholder="نام و نام خانوادگی شما"
							disabled={signInMutation.isPending || signUpMutation.isPending}
						/>
					</motion.div>
				)}

				<div className="space-y-2">
					<label
						className={`block text-sm font-medium ${themeUtils.getTextColor()} opacity-85`}
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
						disabled={signInMutation.isPending || signUpMutation.isPending}
					/>
				</div>

				<div className="space-y-2">
					<label
						className={`block text-sm font-medium ${themeUtils.getTextColor()} opacity-85`}
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
						disabled={signInMutation.isPending || signUpMutation.isPending}
					/>
				</div>

				<motion.button
					type="submit"
					className={`w-full py-3 cursor-pointer rounded-xl transition-all duration-200 mt-6 ${getButtonStyle()}`}
					disabled={signInMutation.isPending || signUpMutation.isPending}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					{signInMutation.isPending || signUpMutation.isPending
						? 'درحال پردازش...'
						: isLogin
							? 'ورود به حساب'
							: 'ایجاد حساب جدید'}
				</motion.button>
			</motion.form>

			<motion.button
				onClick={() => setIsLogin(!isLogin)}
				className={`mt-3 text-sm transition-colors cursor-pointer font-light ${getToggleButtonStyle()}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				whileHover={{ scale: 1.05 }}
			>
				{isLogin
					? 'حساب کاربری ندارید؟ همین حالا ثبت نام کنید'
					: 'قبلاً ثبت نام کرده‌اید؟ وارد شوید'}
			</motion.button>
		</motion.div>
	)
}
