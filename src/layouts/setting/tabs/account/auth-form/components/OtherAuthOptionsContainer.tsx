import LoginGoogleButton from './LoginGoogleButton'
import LoginPasswordButton from './LoginPasswordButton'

type OtherOptionsContainerProps = {
	setShowPasswordForm: React.Dispatch<React.SetStateAction<boolean>>
}

const OtherOptionsContainer: React.FC<OtherOptionsContainerProps> = ({
	setShowPasswordForm,
}) => {
	return (
		<div className="space-y-3 md:space-y-4">
			<div className="relative my-3 md:my-4">
				<span
					aria-hidden="true"
					className="absolute inset-0 flex items-center w-full border-t border-content translate-y-1/2"
				/>

				<div className="relative z-10 flex justify-center">
					<span className="px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium border rounded-full text-content border-content bg-content">
						یا
					</span>
				</div>
			</div>
			<div className="flex flex-col sm:flex-row items-stretch gap-2 md:gap-3">
				<LoginPasswordButton setShowPasswordForm={setShowPasswordForm} />
				<LoginGoogleButton />
			</div>
		</div>
	)
}

export default OtherOptionsContainer
