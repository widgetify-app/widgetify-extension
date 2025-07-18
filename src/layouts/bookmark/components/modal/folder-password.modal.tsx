import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'

interface FolderPasswordModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	folderPassword: string
}

export function FolderPasswordModal({
	isOpen,
	onClose,
	onConfirm,
	folderPassword,
}: FolderPasswordModalProps) {
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const invalidPassword = 'رمز عبور اشتباه است. دوباره امتحان کنید'

	return (
		<Modal
			direction="rtl"
			title="ورود به پوشه"
			isOpen={isOpen}
			onClose={() => {
				setPassword('')
				setErrorMessage('')
				onClose()
			}}
		>
			<label htmlFor="password">رمز عبور پوشه را وارد کنید</label>
			<div className="flex items-end gap-2 pb-[7px]">
				<TextInput
					type="password"
					name="password"
					id="password"
					placeholder="رمز عبور"
					value={password}
					onChange={(v) => setPassword(v)}
					className={`mt-2 w-full px-4 py-3 text-right rounded-lg transition-all duration-300 ${errorMessage && 'border-error'}`}
				/>
				<Button
					size="md"
					isPrimary={true}
					disabled={!password}
					onClick={() => {
						if (folderPassword === password) {
							onConfirm()
							onClose()
							setPassword('')
							setErrorMessage('')
						} else setErrorMessage(invalidPassword)
					}}
					className={
						'btn btn-circle !w-fit px-4 border-none shadow-none disabled:text-gray-400 rounded-xl transition-colors duration-300 ease-in-out'
					}
				>
					تأیید و ورود
				</Button>
			</div>
			{errorMessage && (
				<p className="text-error font-semibold text-[13px] font-[Vazir]">
					{errorMessage}
				</p>
			)}
		</Modal>
	)
}
