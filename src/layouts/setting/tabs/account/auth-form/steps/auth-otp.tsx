import { useState } from 'react'
import { FiSmartphone } from 'react-icons/fi'
import { TextInput } from '../../../../../../components/text-input'
import { Button } from '@/components/button/button'
import { useRequestOtp, useVerifyOtp } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'
import { useAuth } from '@/context/auth.context'

export function AuthWithOTP() {
	const { login } = useAuth()
	const [username, setUsername] = useState('') // email can be phone number as well
	const [otp, setOtp] = useState('')
	const [step, setStep] = useState<'enter-username' | 'enter-otp'>('enter-username')
	const [error, setError] = useState<string | null>(null)
	const { mutateAsync: requestOtp } = useRequestOtp()
	const { mutateAsync: verifyOtp } = useVerifyOtp()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		if (step === 'enter-username') {
			await onSubmitRequest()
		} else {
			await onVerifyOtp()
		}
	}

	const onSubmitRequest = async () => {
		try {
			await requestOtp({ email: username })
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
			const response = await verifyOtp({ email: username, code: otp })
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

	if (step === 'enter-username') {
		return (
			<div className="w-full">
				{/* Header */}
				<div className="flex items-start gap-3 mb-1">
					<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 flex-shrink-0 mt-0.5">
						<FiSmartphone className="w-5 h-5 text-primary" />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-content mb-1.5">
							ورود یا ثبت‌نام در ویجتیفای
						</h3>
						<p className="mb-2 text-sm leading-relaxed text-muted">
							کد تایید به ایمیل یا شما ارسال می‌شود.
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col w-full gap-2 mt-4">
					<div className="space-y-2">
						<label className="block text-sm font-semibold text-content">
							ایمیل
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
								<FiSmartphone className="w-5 h-5 text-gray-400" />
							</div>
							<TextInput
								id="username"
								type="text"
								value={username}
								onChange={setUsername}
								placeholder="example@email.com"
								className="w-full !py-3.5"
							/>
						</div>
					</div>

					<div
						className={`flex items-start gap-3 transition-all p-1 text-sm text-red-700 border border-red-200 rounded-2xl bg-red-50 ${!error && 'opacity-0'}`}
					>
						<div className="flex items-center justify-center w-4 h-4 mt-0.5 bg-red-100 rounded-full flex-shrink-0">
							<span className="w-2 h-2 bg-red-500 rounded-full"></span>
						</div>
						<span>{error}</span>
					</div>

					<div>
						<Button
							type="submit"
							isPrimary={true}
							size="md"
							className="relative flex items-center justify-center w-full px-6 py-3 font-semibold transition-all duration-300 shadow text-white group rounded-xl disabled:!text-gray-100"
						>
							<span className="transition-transform duration-200 group-hover:scale-105">
								ورود به ویجتیفای
							</span>
						</Button>
					</div>
				</form>
			</div>
		)
	}

	return (
		<div className="w-full">
			{/* Header */}
			<div className="flex items-start gap-3 mb-1">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 flex-shrink-0 mt-0.5">
					<FiSmartphone className="w-5 h-5 text-primary" />
				</div>
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-content mb-1.5">
						تایید کد ورود
					</h3>
					<p className="mb-2 text-sm leading-relaxed text-muted">
						کد تایید به{' '}
						<span className="font-semibold text-content">{username}</span>{' '}
						ارسال شد.
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col w-full gap-2 mt-4">
				<div className="space-y-2">
					<label className="block text-sm font-semibold text-content">
						کد تایید
					</label>
					<div className="relative">
						<TextInput
							id="otp"
							type="text"
							value={otp}
							onChange={setOtp}
							placeholder="123456"
							className="w-full !py-3.5 text-center tracking-widest text-lg font-semibold"
							maxLength={6}
						/>
					</div>
				</div>

				<div
					className={`flex items-start gap-3 transition-all p-1 text-sm text-red-700 border border-red-200 rounded-2xl bg-red-50 ${!error && 'opacity-0'}`}
				>
					<div className="flex items-center justify-center w-4 h-4 mt-0.5 bg-red-100 rounded-full flex-shrink-0">
						<span className="w-2 h-2 bg-red-500 rounded-full"></span>
					</div>
					<span>{error}</span>
				</div>

				<div className="flex flex-col gap-2">
					<Button
						type="submit"
						isPrimary={true}
						size="md"
						className="relative flex items-center justify-center w-full px-6 py-3 font-semibold transition-all duration-300 shadow text-white group rounded-xl disabled:!text-gray-100"
						disabled={otp.length !== 6}
					>
						<span className="transition-transform duration-200 group-hover:scale-105">
							تایید کد
						</span>
					</Button>
					<button
						type="button"
						onClick={() => {
							setStep('enter-username')
							setOtp('')
							setError(null)
						}}
						className="text-sm transition-colors text-primary hover:text-primary/80"
					>
						تغییر ایمیل/شماره
					</button>
				</div>
			</form>
		</div>
	)
}
