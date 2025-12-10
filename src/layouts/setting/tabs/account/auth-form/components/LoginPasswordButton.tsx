import Analytics from '@/analytics'
import { FiLock } from 'react-icons/fi'

type LoginPasswordButtonProps = {
	setShowPasswordForm: (show: boolean) => void
}

const LoginPasswordButton: React.FC<LoginPasswordButtonProps> = ({
	setShowPasswordForm,
}) => {
	const handleShowPasswordForm = () => {
		setShowPasswordForm(true)
		Analytics.event('auth_method_changed_to_password')
	}

	return (
		<button
			onClick={handleShowPasswordForm}
			className="group px-8 py-2.5 rounded-xl font-medium shadow-lg h-full w-full flex items-center justify-center border-2 border-content bg-content hover:bg-gray-100 transition-colors gap-2 cursor-pointer"
		>
			<FiLock className="w-5 h-5 transition-all duration-200 group-hover:scale-110" />
			<span className="transition-all duration-200 group-hover:scale-105">
				ورود با رمز عبور
			</span>
		</button>
	)
}

export default LoginPasswordButton
