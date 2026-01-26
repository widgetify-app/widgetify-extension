import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { isEmpty, isLessThan } from '@/utils/validators'
import InputTextError from '../auth-form/components/input-text-error'
import { Button } from '@/components/button/button'
import OtpInput from '../auth-form/components/otp-input'
import {
	useChangePhoneRequest,
	useChangePhoneVerify,
} from '@/services/hooks/user/userService.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'

interface AddPhoneProp {
	isOpen: boolean
	onClose: () => void
}
export function AddPhoneModal(prop: AddPhoneProp) {
	const [step, setStep] = useState('enter-phone')
	const [phone, setPhone] = useState('')
	const [otpCode, setOtp] = useState('')
	const { mutateAsync: requestChange, isPending } = useChangePhoneRequest()
	const { mutateAsync: changePhoneVerify } = useChangePhoneVerify()

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
		if (step === 'enter-phone') {
			if (isEmpty(phone))
				return setError((prev) => ({
					...prev,
					email: 'لطفاً ایمیل/شماره موبایل خود را وارد کنید.',
				}))
			const [err, _] = await safeAwait(requestChange(phone))
			if (err) {
				setError({
					phone: translateError(err) as string,
					otp: null,
				})
			} else {
				setStep('enter-otp')
			}
		} else if (step === 'enter-otp') {
			if (isEmpty(otpCode) || isLessThan(otpCode, 6))
				return setError((prev) => ({
					...prev,
					otp: 'لطفا کد ارسال شده را وارد کنید.',
				}))

			const [err, _] = await safeAwait(
				changePhoneVerify({
					code: otpCode,
					phone,
				})
			)

			if (err) {
				setError({
					otp: translateError(err) as string,
					phone: null,
				})
			} else {
				showToast('شماره موبایل با موفقیت اضافه شد', 'success', {
					alarmSound: true,
				})
				prop.onClose()
			}
		}
	}

	return (
		<Modal
			title="اضافه کردن شماره موبایل"
			isOpen={prop.isOpen}
			onClose={() => prop.onClose()}
			direction="rtl"
		>
			<section>
				<div>
					<p className="text-xs text-muted mt-0.5">
						برای اینکه بتونی با شماره موبایلت هم وارد حسابت بشی!
					</p>
				</div>

				<form
					onSubmit={validateInputs}
					className="flex flex-col gap-3 mt-4 md:gap-4 md:mt-5"
				>
					<div>
						<label
							htmlFor="email"
							className="block mb-1 md:mb-1.5 text-xs md:text-sm font-semibold text-content"
						>
							شماره موبایل
						</label>

						<TextInput
							id="email"
							type="text"
							name="email"
							value={phone}
							onChange={setPhone}
							placeholder="09371112233"
							disabled={isPending || step === 'enter-otp'}
							className="w-full py-2.5! md:py-3.5!"
							autoComplete="on"
							direction="ltr"
						/>
						<InputTextError message={error.phone} />
					</div>
					{step === 'enter-otp' && (
						<div>
							<label className="block mb-2 md:mb-2.5 text-xs md:text-sm font-semibold text-content ">
								کد تایید
							</label>

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
						isPrimary={true}
						size="md"
						loading={isPending}
						disabled={isPending}
						className="relative w-full py-2.5 md:py-3 text-sm md:text-base transition-all duration-200 shadow text-white group rounded-xl disabled:cursor-not-allowed disabled:text-base-content disabled:opacity-50"
					>
						<span className="transition-transform duration-200 group-hover:scale-105">
							{step === 'enter-otp' ? 'تایید' : 'ادامه'}
						</span>
					</Button>
				</form>
			</section>
		</Modal>
	)
}
