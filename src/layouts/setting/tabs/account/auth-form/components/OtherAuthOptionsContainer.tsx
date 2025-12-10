import LoginGoogleButton from './LoginGoogleButton'
import LoginPasswordButton from './LoginPasswordButton'

type OtherOptionsContainerProps = {
	setShowPasswordForm: React.Dispatch<React.SetStateAction<boolean>>
}

const OtherOptionsContainer: React.FC<OtherOptionsContainerProps> = ({
	setShowPasswordForm,
}) => {
	return (
		<>
			<div className="relative my-2">
				<span
					aria-hidden="true"
					className="absolute inset-0 flex items-center w-full border-t border-content translate-y-1/2"
				/>

				<div className="relative z-50 flex justify-center text-sm">
					<span className="px-6 py-2 font-medium border rounded-full text-content border-content bg-content">
						یا
					</span>
				</div>
			</div>
			<div className="flex flex-row items-center gap-2">
				<LoginPasswordButton setShowPasswordForm={setShowPasswordForm} />
				<LoginGoogleButton />
			</div>
		</>
	)
}

export default OtherOptionsContainer
