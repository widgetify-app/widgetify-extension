import { useState } from 'react'
import { FiAtSign, FiKey, FiArrowRight, FiRefreshCw } from 'react-icons/fi'
import { TextInput } from '@/components/text-input'
import { Button } from '@/components/button/button'
import { useRequestOtp, useVerifyOtp } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'
import { useAuth } from '@/context/auth.context'
import { isEmpty, isEmail } from '@/utils/validators'
import InputTextError from './components/InputTextError'
import OtpInput from './components/OtpInput'

type AuthOtpProps = {
	step: 'enter-email' | 'enter-otp'
	setStep: (step: 'enter-email' | 'enter-otp') => void
}

const AuthOtp: React.FC<AuthOtpProps> = ({ step, setStep }) => {
	const { login } = useAuth()
	const [email, setEmail] = useState('')
	const [otp, setOtp] = useState(['', '', '', '', '', ''])

	const [error, setError] = useState<string | null>(null)
	const { mutateAsync: requestOtp, isPending } = useRequestOtp()
	const { mutateAsync: verifyOtp } = useVerifyOtp()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		if (step === 'enter-email') {
			if (isEmpty(email)) {
				setError('لطفاً ایمیل خود را وارد کنید.')
				return
			}

			if (!isEmail(email)) {
				setError('لطفاً یک ایمیل معتبر وارد کنید.')
				return
			}

			await onSendOtp()
		} else if (step === 'enter-otp') {
			if (isEmpty(otp.join(''))) {
				setError('لطفا کد ارسال شده را وارد کنید.')
				return
			}
			await onVerifyOtp()
		}
	}

	const onSendOtp = async () => {
		try {
			await requestOtp({ email })
			setStep('enter-otp')
		} catch (err: any) {
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

	const onVerifyOtp = async () => {
		try {
			setError(null)
			const response = await verifyOtp({ email, code: otp.join('') })
			login(response.data)
		} catch (err: any) {
			const content = translateError(err)
			if (typeof content === 'string') {
				setError(content)
			} else {
				if (Object.keys(content).length === 0) {
					setError('کد تایید نامعتبر است. لطفاً دوباره تلاش کنید.')
					return
				}
				setError(`${Object.keys(content)[0]}: ${Object.values(content)[0]}`)
			}
		}
	}

	if (step === 'enter-email')
		return (
			<section>
				<header className="flex items-center gap-3 ">
					<div
						aria-hidden="true"
						className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10"
					>
						<FiAtSign className="w-5 h-5 text-primary" />
					</div>

					<h4 className="text-lg font-semibold text-content">
						ورود یا ثبت‌نام با ایمیل
					</h4>
				</header>

				<form onSubmit={handleSubmit} className="mt-5">
					<div>
						<label className="block mb-1 text-sm font-semibold text-content">
							ایمیل
						</label>

						<TextInput
							id="email"
							type="email"
							name="email"
							value={email}
							onChange={setEmail}
							placeholder="example@gmail.com"
							className="w-full !py-3.5"
						/>
						<InputTextError
							message={error || ''}
							className={!error ? 'opacity-0' : 'opacity-100'}
						/>
					</div>

					<div className="bg-primary/10 border border-primary/30 rounded-xl p-2 my-5 font-extralight">
						<p className="text-muted text-sm flex items-center gap-1.5 leading-relaxed">
							<span className="text-primary text-lg">ℹ️</span>
							<span> کد تایید به ایمیل شما ارسال می‌شود.</span>
						</p>
					</div>

					<Button
						type="submit"
						isPrimary={true}
						size="md"
						loading={isPending}
						disabled={isPending}
						className="relative w-full transition-all duration-300 shadow text-white group rounded-xl disabled:!text-gray-100"
					>
						<span className="transition-transform duration-200 group-hover:scale-105">
							تایید ایمیل
						</span>
					</Button>
				</form>
			</section>
		)

	return (
		<section>
			<header className="flex items-center gap-3">
				<div
					aria-hidden="true"
					className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10"
				>
					<FiKey className="w-5 h-5 text-primary" />
				</div>

				<div>
					<h4 className="text-lg font-semibold text-content">تایید کد ورود</h4>
					<p className="text-muted text-sm flex items-center gap-1.5 leading-relaxed">
						کد تایید به{' '}
						<span className="font-semibold text-content">{email}</span> ارسال
						شد.
					</p>
				</div>
			</header>

			<form onSubmit={handleSubmit} className="mt-5">
				<div>
					<label className="block mb-1 text-sm font-semibold text-content">
						کد تایید
					</label>

					<OtpInput
						otp={otp}
						setOtp={setOtp}
						error={error}
						setError={setError}
					/>
					<InputTextError
						message={error || ''}
						className={`mr-4 ${!error ? 'opacity-0' : 'opacity-100'}`}
					/>
				</div>

				<button
					type="button"
					className="flex items-center mx-auto hover:text-primary gap-1.5 font-medium   disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-gray-300 group mt-2 mb-4 duration-200"
				>
					<span className="transition-all duration-200 group-hover:scale-105">
						ارسال دوباره کد؟
					</span>
					<FiRefreshCw
						size={16}
						className="transition-all duration-200   group-hover:rotate-180 group-hover:scale-110"
					/>
					{/* TODO: add timer component for resending */}
				</button>

				<Button
					type="submit"
					isPrimary={true}
					size="md"
					className="relative flex items-center justify-center w-full px-6 py-3 font-semibold transition-all duration-300 shadow text-white group rounded-xl disabled:!text-gray-100"
					disabled={otp.join('').length !== 6}
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
					setOtp(['', '', '', '', '', ''])
					setError(null)
				}}
				className="flex items-center mx-auto gap-0.5 my-3 font-medium cursor-pointer group text-gray-400 hover:text-primary duration-200"
			>
				<FiArrowRight
					size={16}
					className="transition-all duration-200 group-hover:translate-x-1 group-hover:scale-110"
				/>
				<span className="transition-all duration-200 group-hover:scale-105">
					بازگشت
				</span>
			</button>
		</section>
	)
}

export default AuthOtp
