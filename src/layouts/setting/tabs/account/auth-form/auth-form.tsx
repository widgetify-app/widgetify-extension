import { useState } from 'react'

import AuthWithPassword from './auth-password'
import AuthOtp from './auth-otp'
import OtherOptionsContainer from './components/OtherAuthOptionsContainer'

const AuthForm = () => {
	const [showPasswordForm, setShowPasswordForm] = useState(false)
	const [AuthOtpStep, setAuthOtpStep] = useState<'enter-email' | 'enter-otp'>(
		'enter-email'
	)

	return (
		<div className="flex flex-col w-full max-w-lg px-2 mx-auto md:px-0">
			<div className="p-4 my-2 border shadow-md md:p-6 border-content bg-content rounded-xl md:rounded-2xl backdrop-blur-sm">
				{showPasswordForm ? (
					<AuthWithPassword />
				) : (
					<AuthOtp step={AuthOtpStep} setStep={setAuthOtpStep} />
				)}
			</div>

			{AuthOtpStep === 'enter-email' && (
				<OtherOptionsContainer
					setShowPasswordForm={setShowPasswordForm}
					showPasswordForm={showPasswordForm}
				/>
			)}
		</div>
	)
}

export default AuthForm
