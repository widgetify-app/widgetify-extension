import LoginGoogleButton from './login-google.button'
import LoginPasswordButton from './login-password.button'
import LoginOtpButton from './login-otp-button'

type OtherOptionsContainerProps = {
	setShowPasswordForm: React.Dispatch<React.SetStateAction<boolean>>
	showPasswordForm: boolean
}

const OtherOptionsContainer: React.FC<OtherOptionsContainerProps> = ({
	setShowPasswordForm,
	showPasswordForm,
}) => {
	return (
		<div className="space-y-2">
			<div className="relative my-1 md:my-4">
				<span
					aria-hidden="true"
					className="absolute inset-0 flex items-center w-full translate-y-1/2 border-t border-content"
				/>

				<div className="relative z-10 flex justify-center">
					<span className="px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium border rounded-full text-content border-content bg-content">
						یا
					</span>
				</div>
			</div>
			<div className="flex flex-col items-stretch gap-2 sm:flex-row md:gap-3">
				{showPasswordForm ? (
					<LoginOtpButton setShowPasswordForm={setShowPasswordForm} />
				) : (
					<LoginPasswordButton setShowPasswordForm={setShowPasswordForm} />
				)}
				<LoginGoogleButton />
			</div>
		</div>
	)
}

export default OtherOptionsContainer
