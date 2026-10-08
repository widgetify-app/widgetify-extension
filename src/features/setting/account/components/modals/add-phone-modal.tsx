import { useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { TextInput } from '@/components/ui'
import { isEmpty, isLessThan } from '@/features/setting/account/utils/validators'
import InputTextError from '../input-text-error'
import OtpInput from '../otp-input'
import {
	useChangePhoneRequest,
	useChangePhoneVerify,
} from '@/services/user/user-service.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { t } from '@/common/i18n'

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
					email: t('setting.modal.phone.required'),
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
					otp: t('setting.modal.phone.otpRequired'),
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
				showToast(t('setting.modal.phone.successToast'), 'success')
				prop.onClose()
			}
		}
	}

	return (
		<Modal
			title={t('setting.modal.phone.title')}
			isOpen={prop.isOpen}
			onClose={() => prop.onClose()}
			closeLabel={t('ui.common.close')}
		>
			<section>
				<div>
					<p className="text-xs text-fg-muted mt-0.5">
						{t('setting.modal.phone.body')}
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
							{t('setting.modal.phone.label')}
						</label>

						<TextInput
							id="email"
							type="text"
							name="email"
							value={phone}
							onChange={setPhone}
							placeholder={t('setting.modal.phone.placeholder')}
							disabled={isPending || step === 'enter-otp'}
							className="w-full py-2.5! md:py-3.5!"
							autoComplete="on"
							direction={phone ? 'auto' : 'rtl'}
						/>
						<InputTextError message={error.phone} />
					</div>
					{step === 'enter-otp' && (
						<div>
							<p className="block mb-2 md:mb-2.5 text-xs md:text-sm font-semibold text-fg">
								{t('setting.modal.phone.otpLabel')}
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
						rounded={'2xl'}
						size="md"
						loading={isPending}
						disabled={isPending}
						className="text-sm md:text-base"
					>
						<span className="transition-transform duration-200 group-hover:scale-105">
							{step === 'enter-otp'
								? t('setting.modal.phone.confirm')
								: t('setting.modal.phone.continue')}
						</span>
					</Button>
				</form>
			</section>
		</Modal>
	)
}
