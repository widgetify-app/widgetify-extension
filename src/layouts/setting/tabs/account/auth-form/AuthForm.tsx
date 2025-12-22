import { useState } from 'react'

import AuthWithPassword from './AuthPassword'
import AuthOtp from './AuthOtp'
import OtherOptionsContainer from './components/OtherAuthOptionsContainer'

const AuthForm = () => {
	const [showPasswordForm, setShowPasswordForm] = useState(false)
	const [AuthOtpStep, setAuthOtpStep] = useState<'enter-email' | 'enter-otp'>(
		'enter-otp'
	)

	return (
		<div className="flex flex-col w-full max-w-lg mx-auto px-2 md:px-0">
			<div className="p-4 md:p-6 lg:p-7 my-2 border shadow-md border-content bg-content rounded-xl md:rounded-2xl backdrop-blur-sm">
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
