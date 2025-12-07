import { useState } from 'react'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { useSignIn, useGoogleSignIn } from '@/services/hooks/auth/authService.hook'
import { translateError } from '@/utils/translate-error'

interface SignInFormProps {
	onSwitchToSignUp: () => void
}

export const SignInForm = ({ onSwitchToSignUp }: SignInFormProps) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [showReferralModal, setShowReferralModal] = useState(false)
	const [referralCode, setReferralCode] = useState('')
	const [googleToken, setGoogleToken] = useState<string | null>(null)

	const { login } = useAuth()
	const signInMutation = useSignIn()
	const googleSignInMutation = useGoogleSignIn()

	const handleGoogleSignIn = async (referralCode?: string) => {
		if (!googleToken) return

		try {
			const response = await googleSignInMutation.mutateAsync({
				token: googleToken,
				referralCode,
			})
			login(response.data)
			Analytics.event('sign_in')
			setShowReferralModal(false)
			setGoogleToken(null)
			setReferralCode('')
		} catch (err) {
			const content = translateError(err)
			if (typeof content === 'string') {
				setError(content)
			} else {
				setError('خطا در ورود با گوگل. لطفاً دوباره تلاش کنید.')
			}
			setShowReferralModal(false)
			setGoogleToken(null)
			setReferralCode('')
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		try {
			const response = await signInMutation.mutateAsync({ email, password })
			login(response.data)
			Analytics.event('sign_in')
		} catch (err) {
			const content = translateError(err)
			if (typeof content === 'string') {
				setError(content)
			} else {
				if (Object.keys(content).length === 0) {
					setError('خطا در ورود. لطفاً دوباره تلاش کنید.')
					return
				}
				setError(`${Object.keys(content)[0]}: ${Object.values(content)[0]}`)
			}
		}
	}

	const loginGoogle = async () => {
		if (await browser.permissions.contains({ permissions: ['identity'] })) {
		} else {
			const granted = await browser.permissions.request({
				permissions: ['identity'],
			})
			if (!granted) {
				console.log('Permission denied')
				return
			}
		}

		const redirectUri = browser.identity.getRedirectURL('google')
		console.log('Redirect URI:', redirectUri)
		const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
		url.searchParams.set(
			'client_id',
			'1062149222368-8cm7q5m4h1amei0b338rifhpqbibis23.apps.googleusercontent.com'
		)
		url.searchParams.set('response_type', 'token')
		url.searchParams.set('redirect_uri', redirectUri)
		url.searchParams.set('prompt', 'consent select_account')
		url.searchParams.set(
			'scope',
			'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
		)

		const redirectUrl = await browser.identity.launchWebAuthFlow({
			url: url.toString(), // لینک OAuth گوگل
			interactive: true,
		})

		const params = new URLSearchParams(redirectUrl?.split('#')[1])
		const token = params.get('access_token')
		console.log('Access Token:', token)

		if (token) {
			setGoogleToken(token)
			setShowReferralModal(true)
		}
	}

	return (
		<div className="flex flex-col w-full h-full">
			<form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
				<div className="flex flex-col gap-1">
					<label className="flex text-sm font-medium text-muted">ایمیل</label>
					<TextInput
						id="email"
						type="email"
						value={email}
						onChange={setEmail}
						placeholder="example@email.com"
						disabled={signInMutation.isPending}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="flex text-sm font-medium text-muted">
						رمز عبور
					</label>
					<TextInput
						id="password"
						type="password"
						value={password}
						onChange={setPassword}
						placeholder="••••••••"
						disabled={signInMutation.isPending}
					/>
					<div className="flex justify-start">
						<a
							href="https://widgetify.ir/forgot-password"
							target="_blank"
							rel="noopener noreferrer"
							className="flex text-sm font-light transition-colors cursor-pointer text-primary hover:text-primary/80 hover:underline"
						>
							رمز عبور خود را فراموش کرده‌اید؟
						</a>
					</div>
				</div>

				<div className="flex items-center justify-center w-full pt-2">
					<Button
						type="submit"
						disabled={signInMutation.isPending}
						isPrimary={true}
						size="md"
						className="flex items-center justify-center px-20 py-2.5 text-white cursor-pointer transition-colors rounded-2xl font-medium shadow-none min-w-[200px]"
					>
						{signInMutation.isPending ? 'درحال پردازش...' : 'ورود به حساب'}
					</Button>
					<Button
						type="button"
						size="md"
						onClick={() => loginGoogle()}
						disabled={googleSignInMutation.isPending}
						className="mr-4 flex items-center justify-center px-4 py-2.5 text-white cursor-pointer transition-colors rounded-2xl font-medium shadow-none min-w-[200px] bg-red-500 hover:bg-red-600 disabled:opacity-50"
					>
						{googleSignInMutation.isPending
							? 'درحال پردازش...'
							: 'ورود با گوگل'}
					</Button>
				</div>
			</form>
			{error && (
				<div className="p-3 mt-4 border rounded-lg bg-error/20 text-error border-error/30">
					<span className="text-center">{error}</span>
				</div>
			)}
			<div className="flex items-center justify-center w-full mt-4">
				<p className="flex items-center gap-1 text-sm text-muted">
					<span>حساب کاربری ندارید؟</span>
					<button
						onClick={onSwitchToSignUp}
						className="flex font-medium transition-colors text-primary hover:text-primary/80 hover:underline"
					>
						ثبت‌نام کنید
					</button>
				</p>
			</div>

			<Modal
				isOpen={showReferralModal}
				onClose={() => setShowReferralModal(false)}
				title=""
				size="sm"
				direction="rtl"
				showCloseButton={false}
			>
				<div className="flex flex-col gap-4 py-2 text-center">
					<div className="flex justify-center">
						<div className="relative">
							<div className="flex items-center justify-center rounded-full w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10">
								<div className="font-sans text-2xl">🎁</div>
							</div>
							<div className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 rounded-full bg-primary">
								<span className="text-xs text-white">!</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<h3 className="text-lg font-semibold text-foreground">
							فقط یک قدم مونده!
						</h3>
						<p className="text-sm leading-relaxed text-muted">
							اگه میخای پاداش بگیری و کد دعوت داری، کد رو وارد کن!
							<br />
							<span className="text-xs font-medium text-primary">
								بدون کد هم می‌تونی ادامه بدی
							</span>
						</p>
					</div>

					{/* Input Section */}
					<div className="flex flex-col gap-3">
						<TextInput
							value={referralCode}
							onChange={setReferralCode}
							placeholder="کد دعـوت را وارد کنید (اختیاری)"
							className="text-center"
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-center gap-3">
						<Button
							type="button"
							onClick={() => handleGoogleSignIn()}
							size="sm"
							className="px-6 py-2.5 rounded-xl text-muted hover:text-foreground transition-colors"
						>
							رد کردن
						</Button>
						<Button
							type="button"
							onClick={() => handleGoogleSignIn(referralCode || undefined)}
							isPrimary={true}
							size="sm"
							className="px-8 py-2.5 rounded-xl font-medium shadow-lg !border-2 !border-gray-200 hover:!border-gray-300"
						>
							{referralCode ? 'تایید و ادامه' : 'ادامه بدون کد'}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
