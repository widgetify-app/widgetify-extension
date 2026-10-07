import { Button, Modal } from '@/components/ui'
import { TextInput } from '@/components/ui'
import { isEmpty, isLessThan } from '@/features/setting/account/utils/validators'
import {
	useChangeEmailRequest,
	useChangeEmailVerify,
} from '@/services/user/user-service.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import InputTextError from '../input-text-error'
import OtpInput from '../otp-input'

interface AddPhoneProp {
	show: boolean
	onClose: (type: 'success' | 'cancel') => void
	currentValue?: string
}
export function AddEmailModal(prop: AddPhoneProp) {
	const [step, setStep] = useState<'enter-email' | 'enter-code'>('enter-email')
	const [email, setEmail] = useState('')
	const [otpCode, setOtp] = useState('')
	const { mutateAsync: requestChange, isPending } = useChangeEmailRequest()
	const { mutateAsync: changeEmailVerify } = useChangeEmailVerify()

	const [error, setError] = useState<{
		otp: string | null
		phone: string | null
	}>({ otp: null, phone: null })

	const resetErrors = () => {
		setError({ otp: null, phone: null })
	}

	const onSetOtp = (value: string) => {
		setOtp(value)
		setError((prev) => ({ ...prev, otp: null }))
	}

	const validateInputs = async (e: React.FormEvent) => {
		e.preventDefault()
		resetErrors()
		if (step === 'enter-email') {
			if (isEmpty(email))
				return setError((prev) => ({
					...prev,
					email: 'ایمیلت رو بنویس',
				}))
			const [err, _] = await safeAwait(requestChange(email))
			if (err) {
				setError({
					phone: translateError(err) as string,
					otp: null,
				})
			} else {
				setStep('enter-code')
			}
		} else if (step === 'enter-code') {
			if (isEmpty(otpCode) || isLessThan(otpCode, 6))
				return setError((prev) => ({
					...prev,
					otp: 'کدی که برات فرستادیم رو بنویس',
				}))

			const [err, _] = await safeAwait(
				changeEmailVerify({
					code: otpCode,
					email,
				})
			)

			if (err) {
				setError({
					otp: translateError(err) as string,
					phone: null,
				})
			} else {
				showToast('ایمیلت اضافه شد', 'success')
				prop.onClose('success')
			}
		}
	}

	return (
		<Modal
			title="اضافه کردن ایمیل"
			isOpen={prop.show}
			onClose={() => prop.onClose('cancel')}
		>
			<section>
				<div>
					<p className="text-xs text-fg-muted mt-0.5">
						با ایمیل، اگه رمزت یادت رفت می‌تونی برگردونیش و حسابت هم امن‌تر
						می‌شه.
					</p>
				</div>

				<form
					onSubmit={validateInputs}
					className="flex flex-col gap-3 mt-4 md:gap-4 md:mt-5"
				>
					<div>
						<label
							htmlFor="email"
							className="block mb-1 md:mb-1.5 text-xs md:text-sm font-semibold text-fg"
						>
							ایمیل
						</label>

						<TextInput
							id="email"
							type="email"
							name="email"
							value={email}
							onChange={setEmail}
							placeholder="iran@gm..."
							disabled={isPending || step === 'enter-code'}
							className="w-full py-2.5! md:py-3.5!"
							autoComplete="on"
							direction="ltr"
						/>
						<InputTextError message={error.phone} />
					</div>
					{step === 'enter-code' && (
						<div>
							<p className="block mb-2 md:mb-2.5 text-xs md:text-sm font-semibold text-fg">
								کد تایید
							</p>

							<OtpInput
								otp={otpCode}
								setOtp={onSetOtp}
								isError={!!error.otp || !!error.phone}
							/>
						</div>
					)}
					<InputTextError message={error.otp} className="justify-center" />
					<Button
						type="submit"
						color={'brand'}
						size="md"
						rounded={'2xl'}
						loading={isPending}
						disabled={isPending}
						className="text-base"
					>
						<span className="transition-transform duration-200 group-hover:scale-105">
							{step === 'enter-code' ? 'تایید' : 'ادامه'}
						</span>
					</Button>
				</form>
			</section>
		</Modal>
	)
}
