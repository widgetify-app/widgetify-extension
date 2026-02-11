import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { isEmpty, isLessThan } from '@/utils/validators'
import { Button } from '@/components/button/button'
import {
	useChangeEmailRequest,
	useChangeEmailVerify,
} from '@/services/hooks/user/userService.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'
import InputTextError from '../../auth-form/components/input-text-error'
import OtpInput from '../../auth-form/components/otp-input'

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
					email: 'لطفاً ایمیل خود را وارد کنید.',
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
					otp: 'لطفا کد ارسال شده را وارد کنید.',
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
				showToast('ایمیل با موفقیت اضافه شد', 'success', {
					alarmSound: true,
				})
				prop.onClose('success')
			}
		}
	}

	return (
		<Modal
			title="اضافه کردن ایمیل"
			isOpen={prop.show}
			onClose={() => prop.onClose('cancel')}
			direction="rtl"
		>
			<section>
				<div>
					<p className="text-xs text-muted mt-0.5">
						با اضافه کردن ایمیل، می‌تونی وقتی پسوردت رو فراموش کردی یا می‌خوای
						امنیت حسابت رو بالا ببری، ازش استفاده کنی.
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
							{step === 'enter-code' ? 'تایید' : 'ادامه'}
						</span>
					</Button>
				</form>
			</section>
		</Modal>
	)
}
