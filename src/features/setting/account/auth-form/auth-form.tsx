import { t } from '@/common/i18n'
import { useState, useEffect, useRef } from 'react'
import { TextInput } from '@/components/ui'
import {
	useGetAuthStatus,
	useRequestOtp,
	useVerifyOtp,
	useSignIn,
} from '@/services/auth/auth-service.hook'
import { translateError } from '@/common/utils/translate-error'
import { useAuth } from '@/context/auth.context'
import { isEmpty, isEmail, isLessThan } from '@/features/setting/account/utils/validators'
import InputTextError from '../components/input-text-error'
import OtpInput from '../components/otp-input'
import { callEvent } from '@/common/utils/call-event'
import { sleep } from '@/common/utils/timeout'
import { Icon } from '@/icons'
import { Alert, Button } from '@/components/ui'
import LoginGoogleButton from './components/login-google-button'
import Analytics from '@/analytics'

type AuthFlowStep = 'identifier' | 'password' | 'otp'

const RESEND_COOLDOWN_SEC = 60

const AuthForm = () => {
	const { login } = useAuth()
	const [step, setStep] = useState<AuthFlowStep>('identifier')
	const [identifier, setIdentifier] = useState('')
	const [password, setPassword] = useState('')
	const [otp, setOtp] = useState('')
	const [resendCooldown, setResendCooldown] = useState(0)

	const timerRef = useRef<NodeJS.Timeout | null>(null)

	const [error, setError] = useState<{
		identifier: string | null
		password: string | null
		otp: string | null
		api: string | null
	}>({ identifier: null, password: null, otp: null, api: null })

	const resetErrors = () => {
		setError({ identifier: null, password: null, otp: null, api: null })
	}

	useEffect(() => {
		if (resendCooldown > 0) {
			timerRef.current = setTimeout(() => {
				setResendCooldown((prev) => prev - 1)
			}, 1000)
		}
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [resendCooldown])

	const startCooldown = (sec: number = RESEND_COOLDOWN_SEC) => {
		setResendCooldown(sec)
	}

	const { data: authStatus } = useGetAuthStatus()
	const { mutateAsync: requestOtp, isPending: isOtpSending } = useRequestOtp()
	const { mutateAsync: verifyOtp, isPending: isOtpVerifying } = useVerifyOtp()
	const { mutateAsync: signInMutation, isPending: isSigningIn } = useSignIn()

	const isEmailInput = isEmail(identifier.trim())

	const handleIdentifierSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		resetErrors()

		const trimmed = identifier.trim()
		if (isEmpty(trimmed)) {
			return setError((prev) => ({
				...prev,
				identifier: t('setting.auth.identifierRequired'),
			}))
		}

		if (isEmail(trimmed)) {
			setStep('password')
		} else {
			handleSendOtp(trimmed)
		}
	}

	const handleSendOtp = async (target?: string) => {
		if (resendCooldown > 0) return

		resetErrors()
		const inputTarget = (target || identifier).trim()

		if (isEmpty(inputTarget)) {
			return setError((prev) => ({
				...prev,
				identifier: t('setting.auth.identifierRequired'),
			}))
		}

		try {
			let res: any
			if (isEmail(inputTarget)) {
				res = await requestOtp({ email: inputTarget })
			} else {
				res = await requestOtp({ phone: inputTarget })
			}

			const serverTtl = res?.data?.ttl || res?.ttl || RESEND_COOLDOWN_SEC
			startCooldown(serverTtl)
			setStep('otp')
			Analytics.event('auth_otp_requested')
		} catch (err: any) {
			const errMsg = err?.response?.data?.message
			if (typeof errMsg === 'string' && errMsg.startsWith('OTP_RATE_LIMIT:')) {
				const rem = parseInt(errMsg.split(':')[1], 10)
				if (!Number.isNaN(rem)) {
					startCooldown(rem)
					setStep('otp')
					return
				}
			}

			const content = translateError(err)
			setError((prev) => ({
				...prev,
				api:
					typeof content === 'string'
						? content
						: t('setting.auth.sendCodeError'),
			}))
		}
	}

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		resetErrors()

		const trimmed = identifier.trim()
		if (isEmpty(password)) {
			return setError((prev) => ({
				...prev,
				password: t('setting.auth.passwordRequired'),
			}))
		}

		if (isLessThan(password, 6)) {
			return setError((prev) => ({
				...prev,
				password: t('setting.auth.passwordMinLength'),
			}))
		}

		try {
			const response = await signInMutation({
				email: trimmed,
				password,
			})
			login(response.data)
			Analytics.event('sign_in')
		} catch (err: any) {
			const content = translateError(err)
			if (typeof content === 'string') {
				setError((prev) => ({ ...prev, api: content }))
			} else {
				if (content && Object.keys(content).length > 0) {
					setError((prev) => ({
						...prev,
						password: content.password || null,
						identifier: content.email || null,
						api: null,
					}))
				} else {
					setError((prev) => ({
						...prev,
						api: t('setting.auth.credentialsError'),
					}))
				}
			}
		}
	}

	const handleOtpSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		resetErrors()

		if (isEmpty(otp) || isLessThan(otp, 6)) {
			return setError((prev) => ({
				...prev,
				otp: t('setting.auth.otpRequired'),
			}))
		}

		try {
			const trimmed = identifier.trim()
			let response: any
			if (isEmail(trimmed)) {
				response = await verifyOtp({ email: trimmed, code: otp })
			} else {
				response = await verifyOtp({ phone: trimmed, code: otp })
			}

			if (response.isNewUser) {
				callEvent('openWizardModal')
				await sleep(500)
			}

			login(response.data)
			Analytics.event('auth_otp_verified')
		} catch (err: any) {
			const content = translateError(err)
			if (typeof content === 'string') {
				if (err.response?.data?.message === 'INVALID_OTP_CODE') {
					setError((prev) => ({
						...prev,
						otp: t('setting.auth.otpError'),
					}))
				} else {
					setError((prev) => ({ ...prev, api: content }))
				}
			} else {
				setError((prev) => ({
					...prev,
					otp: t('setting.auth.otpError'),
				}))
			}
		}
	}

	const goBackToIdentifier = () => {
		setStep('identifier')
		setPassword('')
		setOtp('')
		resetErrors()
	}

	return (
		<div className="flex flex-col w-full px-1 py-1">
			{authStatus?.content && step === 'identifier' && (
				<Alert tone="warning" className="mb-4">
					{authStatus.content}
				</Alert>
			)}

			{step === 'identifier' && (
				<div className="flex flex-col">
					<div className="mb-5 text-center">
						<h2 className="text-lg font-bold tracking-tight text-fg">
							{t('setting.auth.title')}
						</h2>
						<p className="mt-1 text-xs text-fg-muted">
							{t('setting.auth.identifierRequired')}
						</p>
					</div>

					<form
						onSubmit={handleIdentifierSubmit}
						className="flex flex-col gap-3"
					>
						<div>
							<TextInput
								id="identifier"
								type="text"
								name="identifier"
								value={identifier}
								onChange={(val) => {
									setIdentifier(val)
									resetErrors()
								}}
								placeholder={t('setting.auth.identifierPlaceholder')}
								disabled={isOtpSending}
								className="w-full h-11 rounded-xl! text-sm"
								autoComplete="on"
								direction={!identifier ? 'rtl' : 'ltr'}
							/>
							<InputTextError message={error.identifier || error.api} />
						</div>

						<Button
							type="submit"
							color="brand"
							size="md"
							rounded="xl"
							loading={isOtpSending}
							disabled={isOtpSending || !identifier.trim()}
							className="w-full text-sm font-semibold transition-ui shadow-sm h-11 hover:brightness-105"
						>
							{isOtpSending
								? t('setting.auth.checking')
								: t('setting.auth.continue')}
						</Button>
					</form>

					<div className="relative my-4">
						<span
							aria-hidden="true"
							className="absolute inset-0 flex items-center w-full translate-y-1/2 border-t border-surface-3"
						/>
						<div className="relative z-10 flex justify-center">
							<span className="px-3 py-0.5 text-xs font-medium text-fg-muted bg-surface rounded-full">
								{t('setting.auth.orDivider')}
							</span>
						</div>
					</div>

					<LoginGoogleButton />
				</div>
			)}

			{step === 'password' && (
				<div className="flex flex-col">
					<div className="mb-5 text-center">
						<h2 className="text-lg font-bold tracking-tight text-fg">
							{t('setting.auth.passwordLabel')}
						</h2>
						<div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-fg-muted">
							<span
								dir="ltr"
								className="font-mono truncate text-fg max-w-50"
								title={identifier}
							>
								{identifier}
							</span>
							<span>•</span>
							<button
								type="button"
								onClick={goBackToIdentifier}
								className="font-medium cursor-pointer text-brand hover:underline"
							>
								{t('setting.auth.change')}
							</button>
						</div>
					</div>

					{error.api && (
						<Alert tone="danger" className="mb-3">
							{error.api}
						</Alert>
					)}

					<form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
						<div>
							<TextInput
								id="password"
								type="password"
								value={password}
								onChange={(val) => {
									setPassword(val)
									resetErrors()
								}}
								placeholder={t('setting.auth.passwordPlaceholder')}
								disabled={isSigningIn}
								className="w-full h-11 rounded-xl! text-sm"
								direction={password ? 'ltr' : 'rtl'}
							/>
							<InputTextError message={error.password} />
						</div>

						<Button
							type="submit"
							disabled={isSigningIn || !password}
							loading={isSigningIn}
							color="brand"
							size="md"
							rounded="xl"
							className="w-full text-sm font-semibold transition-ui shadow-sm h-11 hover:brightness-105"
						>
							{isSigningIn
								? t('setting.auth.signingIn')
								: t('setting.auth.signIn')}
						</Button>

						<button
							type="button"
							onClick={() => handleSendOtp()}
							disabled={isOtpSending}
							className="w-full mt-1 h-10 px-3 rounded-xl border border-surface-3 bg-surface hover:bg-fill-2 text-xs font-medium text-fg flex items-center justify-center gap-2 cursor-pointer transition-ui active:scale-[0.99] shadow-sm"
						>
							<Icon name="mail" className="w-4 h-4 text-fg-muted" />
							<span>
								{isOtpSending
									? t('setting.auth.sending')
									: t('setting.auth.loginWithOtp')}
							</span>
						</button>
					</form>
				</div>
			)}

			{step === 'otp' && (
				<div className="flex flex-col">
					<div className="mb-5 text-center">
						<h2 className="text-lg font-bold tracking-tight text-fg">
							{t('setting.auth.otpLabel')}
						</h2>
						<p className="flex items-center justify-center gap-1 mt-1 text-xs text-fg-muted">
							<span>{t('setting.auth.otpSentPrefix')}</span>
							<span
								dir="ltr"
								className="font-mono font-semibold truncate text-fg max-w-44"
								title={identifier}
							>
								{identifier}
							</span>
							<span>{t('setting.auth.otpSentSuffix')}</span>
						</p>
					</div>

					<form onSubmit={handleOtpSubmit} className="flex flex-col gap-3">
						<div>
							<OtpInput
								otp={otp}
								setOtp={(val) => {
									setOtp(val)
									setError((prev) => ({ ...prev, otp: null }))
								}}
								isError={!!error.otp || !!error.api}
							/>
							<InputTextError
								message={error.otp || error.api}
								className="justify-center"
							/>
						</div>

						<div className="flex items-center justify-between px-1 text-xs text-fg-muted">
							{resendCooldown > 0 ? (
								<div className="flex items-center gap-1 font-mono select-none text-fg-muted">
									<Icon name="clock" className="w-3.5 h-3.5" />
									<span>
										{Math.floor(resendCooldown / 60)}:
										{String(resendCooldown % 60).padStart(2, '0')}
									</span>
									<span className="font-sans text-2xs mr-1">
										{t('setting.auth.resendCountdown')}
									</span>
								</div>
							) : (
								<button
									type="button"
									onClick={() => handleSendOtp()}
									disabled={isOtpSending}
									className="flex items-center gap-1 transition-colors cursor-pointer hover:text-brand disabled:opacity-50"
								>
									<Icon
										name="refresh"
										className="w-3.5 h-3.5"
										spin={isOtpSending}
									/>
									<span>
										{isOtpSending
											? t('setting.auth.sending')
											: t('setting.auth.resendCode')}
									</span>
								</button>
							)}

							{isEmailInput ? (
								<button
									type="button"
									onClick={() => {
										setStep('password')
										setOtp('')
										resetErrors()
									}}
									className="transition-colors cursor-pointer hover:text-brand"
								>
									{t('setting.auth.loginWithPassword')}
								</button>
							) : (
								<button
									type="button"
									onClick={goBackToIdentifier}
									className="transition-colors cursor-pointer hover:text-fg"
								>
									{t('setting.auth.changeNumber')}
								</button>
							)}
						</div>

						<Button
							type="submit"
							color="brand"
							size="md"
							rounded="xl"
							loading={isOtpVerifying}
							disabled={otp.length !== 6 || isOtpVerifying}
							className="w-full mt-1 text-sm font-semibold transition-ui shadow-sm h-11 hover:brightness-105"
						>
							{isOtpVerifying
								? t('setting.auth.checking')
								: t('setting.auth.confirmAndSignIn')}
						</Button>
					</form>
				</div>
			)}
		</div>
	)
}

export default AuthForm
