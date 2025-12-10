import { useState } from 'react'

import Analytics from '@/analytics'
import AuthWithPassword from './AuthPassword'
import AuthOtp from './AuthOtp'
import OtherOptionsContainer from './components/OtherAuthOptionsContainer'

const AuthForm = () => {
	const [showPasswordForm, setShowPasswordForm] = useState(false)
	const [step, setStep] = useState<'enter-email' | 'enter-otp'>('enter-otp')

	const handleBackToOTP = () => {
		setShowPasswordForm(false)
		Analytics.event('auth_method_changed_to_otp')
	}

	return (
		<div className="flex flex-col w-full max-w-lg mx-auto ">
			<div className="p-7 my-2 border shadow border-content bg-content rounded-2xl backdrop-blur-sm">
				{showPasswordForm ? (
					<AuthWithPassword onBack={handleBackToOTP} />
				) : (
					<AuthOtp step={step} setStep={setStep} />
				)}
			</div>

			{!showPasswordForm && step === 'enter-email' && (
				<OtherOptionsContainer setShowPasswordForm={setShowPasswordForm} />
			)}
		</div>
	)
}

export default AuthForm
