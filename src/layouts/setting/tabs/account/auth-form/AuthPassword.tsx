import { useState } from 'react'
import { FiLock } from 'react-icons/fi'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { useSignIn } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'
import InputTextError from './components/InputTextError'
import { isEmail, isEmpty, isLessThan } from '@/utils/validators'

export default function AuthPassword() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<{ email: string | null; password: string | null }>(
		{ email: null, password: null }
	)

	const { login } = useAuth()
	const { mutateAsync: signInMutation, isPending } = useSignIn()

	const resetErrors = () => {
		setError({ email: null, password: null })
	}

	const validateInputs = () => {
		// Email validation
		if (isEmpty(email))
			return setError((prev) => ({
				...prev,
				email: 'لطفاً ایمیل خود را وارد کنید.',
			}))

		if (!isEmail(email))
			return setError((prev) => ({
				...prev,
				email: 'لطفاً یک ایمیل معتبر وارد کنید.',
			}))

		// Password validation
		if (isEmpty(password))
			return setError((prev) => ({
				...prev,
				password: 'لطفا رمز عبور خود را وارد کنید.',
			}))

		if (isLessThan(password, 6))
			return setError((prev) => ({
				...prev,
				password: 'رمز عبور باید حداقل ۶ کاراکتر باشد.',
			}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		resetErrors()

		// try {
		// 	const response = await signInMutation({
		// 		email,
		// 		password,
		// 	})
		// 	login(response.data)
		// 	Analytics.event('sign_in')
		// } catch (err) {
		// 	const content = translateError(err)
		// 	if (typeof content === 'string') {
		// 		setError(content)
		// 	} else {
		// 		if (Object.keys(content).length === 0) {
		// 			setError('خطا در ورود. لطفاً دوباره تلاش کنید.')
		// 			return
		// 		}
		// 		setError(`${Object.keys(content)[0]}: ${Object.values(content)[0]}`)
		// 	}
		// }
	}

	return (
		<section>
			<header className="flex items-center gap-2.5 md:gap-3">
				<div
					aria-hidden="true"
					className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex-shrink-0"
				>
					<FiLock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
				</div>
				<div>
					<h3 className="text-base md:text-lg font-semibold text-content">
						ورود با رمز عبور
					</h3>
					<p className="text-xs md:text-sm text-muted mt-0.5">
						با ایمیل و رمز عبور خود وارد شوید
					</p>
				</div>
			</header>

			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-3 md:gap-4 mt-4 md:mt-5"
			>
				<div>
					<label
						htmlFor="email"
						className="block mb-1 md:mb-1.5 text-xs md:text-sm font-semibold text-content"
					>
						ایمیل
					</label>

					<TextInput
						id="email"
						name="email"
						type="email"
						value={email}
						onChange={setEmail}
						placeholder="example@email.com"
						disabled={isPending}
						className="w-full !py-2.5 md:!py-3.5"
					/>
					<InputTextError message={error.email} />
				</div>

				<div>
					<label
						htmlFor="password"
						className="block mb-1 md:mb-1.5 text-xs md:text-sm font-semibold text-content"
					>
						رمز عبور
					</label>

					<TextInput
						id="password"
						type="password"
						value={password}
						onChange={setPassword}
						placeholder="رمز عبور خود را وارد کنید"
						disabled={isPending}
						className="w-full !py-2.5 md:!py-3.5"
					/>
					<InputTextError message={error.password} />
				</div>

				<Button
					type="submit"
					disabled={isPending || !email || !password}
					loading={isPending}
					isPrimary={true}
					size="md"
					className="flex items-center justify-center w-full py-2.5 md:py-3 text-sm md:text-base text-white transition-all duration-200 rounded-xl md:rounded-2xl font-medium shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending ? 'درحال پردازش...' : 'ورود به حساب'}
				</Button>
			</form>
		</section>
	)
}
