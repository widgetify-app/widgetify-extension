import { useState } from 'react'
import { FiAtSign, FiKey, FiArrowRight, FiRefreshCw } from 'react-icons/fi'
import { TextInput } from '@/components/text-input'
import { Button } from '@/components/button/button'
import { useRequestOtp, useVerifyOtp } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'
import { useAuth } from '@/context/auth.context'
import { isEmpty, isEmail, isLessThan } from '@/utils/validators'
import InputTextError from './components/InputTextError'
import OtpInput from './components/OtpInput'

type AuthOtpProps = {
	step: 'enter-email' | 'enter-otp'
	setStep: (step: 'enter-email' | 'enter-otp') => void
}

const AuthOtp: React.FC<AuthOtpProps> = ({ step, setStep }) => {
	const { login } = useAuth()
	const [email, setEmail] = useState('')
	const [otp, setOtp] = useState('')

	const [error, setError] = useState<{
		email: string | null
		otp: string | null
		api: string | null
	}>({ email: null, otp: null, api: null })

	const resetErrors = () => {
		setError({ email: null, otp: null, api: null })
	}

	const { mutateAsync: requestOtp, isPending } = useRequestOtp()
	const { mutateAsync: verifyOtp } = useVerifyOtp()

	const validateInputs = async (e: React.FormEvent) => {
		e.preventDefault()
		resetErrors()

		if (step === 'enter-email') {
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

			onSendOtp()
		} else if (step === 'enter-otp') {
			// OTP validation
			if (isEmpty(otp) || isLessThan(otp, 6))
				return setError((prev) => ({
					...prev,
					otp: 'لطفا کد ارسال شده را وارد کنید.',
				}))

			onVerifyOtp()
		}
	}

	const onSendOtp = async () => {
		try {
			await requestOtp({ email })
			setStep('enter-otp')
		} catch (err: any) {
			const content = translateError(err)
			console.log(content)
			// if (typeof content === 'string') {
			// 	setError((prev) => ({ ...prev, api: content }))
			// } else {
			// 	if (Object.keys(content).length === 0) {
			// 		setError('خطا در ورود. لطفاً دوباره تلاش کنید.')
			// 		return
			// 	}
			// 	setError(`${Object.keys(content)[0]}: ${Object.values(content)[0]}`)
			// }
		}
	}

	const onVerifyOtp = async () => {
		// try {
		// 	setError(null)
		// 	const response = await verifyOtp({ email, code: otp })
		// 	login(response.data)
		// } catch (err: any) {
		// 	const content = translateError(err)
		// 	if (typeof content === 'string') {
		// 		setError(content)
		// 	} else {
		// 		if (Object.keys(content).length === 0) {
		// 			setError('کد تایید نامعتبر است. لطفاً دوباره تلاش کنید.')
		// 			return
		// 		}
		// 		setError(`${Object.keys(content)[0]}: ${Object.values(content)[0]}`)
		// 	}
		// }
	}

	if (step === 'enter-email')
		return (
			<section>
				<header className="flex items-center gap-2.5 md:gap-3">
					<div
						aria-hidden="true"
						className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex-shrink-0"
					>
						<FiAtSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
					</div>
					<div>
						<h3 className="text-base md:text-lg font-semibold text-content">
							ورود یا ثبت‌نام با ایمیل
						</h3>
						<p className="text-xs md:text-sm text-muted mt-0.5">
							کد تایید به ایمیل شما ارسال می‌شود.
						</p>
					</div>
				</header>

				<form
					onSubmit={validateInputs}
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
							type="email"
							name="email"
							value={email}
							onChange={setEmail}
							placeholder="example@gmail.com"
							disabled={isPending}
							className="w-full !py-2.5 md:!py-3.5"
						/>
						<InputTextError message={error.email} />
					</div>
					<Button
						type="submit"
						isPrimary={true}
						size="md"
						loading={isPending}
						disabled={isPending || !email}
						className="relative w-full py-2.5 md:py-3 text-sm md:text-base transition-all duration-200 shadow text-white group rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span className="transition-transform duration-200 group-hover:scale-105">
							{isPending ? 'درحال ارسال...' : 'تایید ایمیل'}
						</span>
					</Button>
				</form>
			</section>
		)

	return (
		<section>
			<header className="flex items-center gap-2.5 md:gap-3">
				<div
					aria-hidden="true"
					className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex-shrink-0"
				>
					<FiKey className="w-4 h-4 md:w-5 md:h-5 text-primary" />
				</div>

				<div className="min-w-0 flex-1">
					<h4 className="text-base md:text-lg font-semibold text-content">
						تایید کد ورود
					</h4>
					<p className="text-muted text-xs md:text-sm flex flex-wrap items-center gap-1 md:gap-1.5 leading-relaxed mt-0.5">
						<span>کد تایید به</span>
						<span
							className="font-semibold text-content truncate max-w-[200px]"
							title={email}
						>
							{email}
						</span>
						<span>ارسال شد.</span>
					</p>
				</div>
			</header>

			<form onSubmit={validateInputs} className="mt-4 md:mt-5">
				<div>
					<label className="block mb-2 md:mb-2.5 text-xs md:text-sm font-semibold text-content text-center">
						کد تایید
					</label>

					<OtpInput
						otp={otp}
						setOtp={setOtp}
						isError={!!error.otp || !!error.api}
					/>
					<InputTextError message={error.otp} className="justify-center" />
				</div>{' '}
				<button
					type="button"
					aria-label="ارسال دوباره کد تایید"
					className="flex items-center mx-auto hover:text-primary gap-1 md:gap-1.5 text-xs md:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-gray-300 group mt-2 mb-3 md:mb-4 duration-200 active:scale-95"
				>
					<span className="transition-all duration-200 group-hover:scale-105">
						ارسال دوباره کد؟
					</span>
					<FiRefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-200 group-hover:rotate-180 group-hover:scale-110" />
					{/* TODO: add timer component for resending */}
				</button>
				<Button
					type="submit"
					isPrimary={true}
					size="md"
					className="relative flex items-center justify-center w-full py-2.5 md:py-3 text-sm md:text-base font-semibold transition-all duration-200 shadow text-white group rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={otp.length !== 6}
				>
					<span className="transition-transform duration-200 group-hover:scale-105">
						تایید کد
					</span>
				</Button>
			</form>

			<button
				type="button"
				onClick={() => {
					setStep('enter-email')
					setOtp('')
					resetErrors()
				}}
				aria-label="بازگشت به صفحه ایمیل"
				className="flex items-center mx-auto gap-1 md:gap-1.5 my-2.5 md:my-3 text-xs md:text-sm font-medium cursor-pointer group text-gray-400 hover:text-primary hover:bg-base-200 px-3 py-1.5 rounded-lg duration-200 active:scale-95"
			>
				<FiArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-200 group-hover:translate-x-1 group-hover:scale-110" />
				<span className="transition-all duration-200 group-hover:scale-105">
					بازگشت
				</span>
			</button>
		</section>
	)
}

export default AuthOtp
