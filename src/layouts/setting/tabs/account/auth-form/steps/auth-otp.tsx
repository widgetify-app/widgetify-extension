import { useState } from 'react'
import { FiSmartphone } from 'react-icons/fi'
import { TextInput } from '../../../../../../components/text-input'
import { Button } from '@/components/button/button'

export function AuthWithOTP() {
	// Implementation of OTP authentication step(email/SMS)-> enter OTP code -> verify
	const [username, setUsername] = useState('') // email can be phone number as well
	const [step] = useState<'enter-username' | 'enter-otp'>('enter-username')
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
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
							کد تایید به ایمیل یا شماره شما ارسال می‌شود.
						</p>
					</div>
				</div>

				{/* Step Indicator */}

				<form onSubmit={handleSubmit} className="flex flex-col w-full gap-2 mt-4">
					<div className="space-y-2">
						<label className="block text-sm font-semibold text-content">
							ایمیل یا شماره موبایل
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
								placeholder="example@email.com یا 09123456789"
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
}
