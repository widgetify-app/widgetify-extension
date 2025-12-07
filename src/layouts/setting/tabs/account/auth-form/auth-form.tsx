import { useState } from 'react'
import { FiLock } from 'react-icons/fi'
import Analytics from '@/analytics'
import { AuthWithPassword } from './steps/auth-password'
import { AuthWithOTP } from './steps/auth-otp'
import { LoginGoogleButton } from './components/login-google.button'

export const AuthForm = () => {
	const [showPasswordForm, setShowPasswordForm] = useState(false)

	const handleShowPasswordForm = () => {
		setShowPasswordForm(true)
		Analytics.event('auth_method_changed_to_password')
	}

	const handleBackToOTP = () => {
		setShowPasswordForm(false)
		Analytics.event('auth_method_changed_to_otp')
	}

	return (
		<div className="flex flex-col w-full max-w-lg mx-auto ">
			<div className="p-6 border shadow border-content bg-content rounded-2xl backdrop-blur-sm">
				{showPasswordForm ? (
					<AuthWithPassword onBack={handleBackToOTP} />
				) : (
					<AuthWithOTP />
				)}
			</div>

			{!showPasswordForm && (
				<>
					<div className="relative my-2">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-content"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-6 py-2 font-medium border rounded-full text-content border-content bg-content">
								یا
							</span>
						</div>
					</div>

					<div className="flex flex-row items-center gap-2">
						<LoginGoogleButton />

						<button
							onClick={handleShowPasswordForm}
							className="group px-8 py-2.5 rounded-xl font-medium shadow-lg h-full w-full flex items-center justify-center border-2 border-content bg-content hover:bg-gray-100 transition-colors gap-2 cursor-pointer"
						>
							<FiLock className="w-5 h-5 transition-all duration-200 group-hover:scale-110" />
							<span className="transition-all duration-200 group-hover:scale-105">
								ورود با رمز عبور
							</span>
						</button>
					</div>
				</>
			)}
		</div>
	)
}
