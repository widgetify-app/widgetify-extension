import Analytics from '@/analytics'
import { FiMail } from 'react-icons/fi'

type LoginOtpButtonProps = {
	setShowPasswordForm: (show: boolean) => void
}

const LoginOtpButton: React.FC<LoginOtpButtonProps> = ({ setShowPasswordForm }) => {
	const handleShowOtpForm = () => {
		setShowPasswordForm(false)
		Analytics.event('auth_method_changed_to_otp')
	}

	return (
		<button
			type="button"
			onClick={handleShowOtpForm}
			aria-label="ورود با رمز عبور"
			className="group px-4 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-medium shadow-md hover:shadow-lg w-full flex items-center justify-center border-2 border-content bg-content hover:bg-base-200 transition-all duration-200 gap-1.5 md:gap-2 cursor-pointer active:scale-95"
		>
			<FiMail className="w-4 h-4 md:w-5 md:h-5 transition-all duration-200 group-hover:scale-110 flex-shrink-0" />
			<span className="transition-all duration-200 group-hover:scale-105 whitespace-nowrap">
				ورود با کد موقت
			</span>
		</button>
	)
}

export default LoginOtpButton
