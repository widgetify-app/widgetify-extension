import { useState } from 'react'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { useSignIn } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'

interface Prop {
	onBack: () => void
}
export default function AuthPassword({ onBack }: Prop) {
	const [username, setUsername] = useState('') // email can be phone number as well
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)

	const { login } = useAuth()
	const signInMutation = useSignIn()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		try {
			const response = await signInMutation.mutateAsync({
				email: username,
				password,
			})
			login(response.data)
			Analytics.event('sign_in')
		} catch (err) {
			const content = translateError(err)
			if (typeof content === 'string') {
				setError(content)
			} else {
				if (Object.keys(content).length === 0) {
					setError('خطا در ورود. لطفاً دوباره تلاش کنید.')
					return
				}
				setError(`${Object.keys(content)[0]}: ${Object.values(content)[0]}`)
			}
		}
	}
	return (
		<div className="flex flex-col w-full gap-2">
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 flex-shrink-0 mt-0.5">
					<FiLock className="w-5 h-5 text-primary" />
				</div>
				<div>
					<h3 className="text-lg font-semibold text-content">
						ورود با رمز عبور
					</h3>
					<p className="text-sm text-muted">
						با ایمیل و رمز عبور خود وارد شوید
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
				<div className="space-y-2">
					<label className="block text-sm font-semibold text-content">
						ایمیل
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
							<FiMail className="w-5 h-5 text-gray-400" />
						</div>
						<TextInput
							id="username"
							type="email"
							value={username}
							onChange={setUsername}
							placeholder="example@email.com"
							disabled={signInMutation.isPending}
							className="w-full py-3"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label className="block text-sm font-semibold text-content">
							رمز عبور
						</label>
						<a
							href="https://widgetify.ir/forgot-password"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm font-medium text-blue-600 transition-all duration-200 cursor-pointer hover:text-blue-700 hover:underline underline-offset-2"
						>
							فراموش کردم
						</a>
					</div>
					<div className="relative">
						<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
							<FiLock className="w-5 h-5 text-gray-400" />
						</div>
						<TextInput
							id="password"
							type="password"
							value={password}
							onChange={setPassword}
							placeholder="رمز عبور خود را وارد کنید"
							disabled={signInMutation.isPending}
							className="w-full py-3"
						/>
					</div>
				</div>

				{error && (
					<div className="flex items-start gap-3 p-4 text-sm text-red-700 border border-red-200 rounded-xl bg-red-50">
						<div className="flex items-center justify-center w-5 h-5 mt-0.5 bg-red-100 rounded-full flex-shrink-0">
							<span className="w-2 h-2 bg-red-500 rounded-full"></span>
						</div>
						<span>{error}</span>
					</div>
				)}

				<Button
					type="submit"
					disabled={signInMutation.isPending}
					isPrimary={true}
					size="md"
					className="flex items-center justify-center px-20 py-2.5 text-white cursor-pointer transition-colors rounded-2xl font-medium shadow-none min-w-[200px]"
				>
					{signInMutation.isPending ? 'درحال پردازش...' : 'ورود به حساب'}
				</Button>

				{/* Back Button */}
				<div className="flex justify-center mt-2">
					<button
						type="button"
						onClick={onBack}
						className="flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200 bg-transparent border-gray-200 rounded-lg cursor-pointer text-content group hover:border-gray-300 "
					>
						<FiArrowRight className="w-4 h-4 transition-all duration-200 group-hover:translate-x-1 group-hover:scale-110" />
						<span className="transition-all duration-200 group-hover:scale-105">
							بازگشت
						</span>
					</button>
				</div>
			</form>
		</div>
	)
}
