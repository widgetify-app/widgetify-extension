import { IconLoading } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import {
	type AuthResponse,
	useGoogleSignIn,
} from '@/services/hooks/auth/auth-service.hook'
import { useState } from 'react'
import { safeAwait } from '@/services/api'
import type { AxiosError } from 'axios'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { sleep } from '@/common/utils/timeout'

export default function LoginGoogleButton() {
	const { login } = useAuth()
	const [isLoading, setIsLoading] = useState(false)
	const googleSignInMutation = useGoogleSignIn()

	const loginGoogle = async () => {
		Analytics.event('auth_method_changed_to_google')
		setIsLoading(true)
		try {
			if (
				await browser.permissions.contains({
					permissions: ['identity'],
				})
			) {
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
			const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
			url.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID)
			url.searchParams.set('response_type', 'token')
			url.searchParams.set('redirect_uri', redirectUri)
			url.searchParams.set('prompt', 'consent select_account')
			url.searchParams.set(
				'scope',
				'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
			)

			const redirectUrl = await browser.identity.launchWebAuthFlow({
				url: url.toString(),
				interactive: true,
			})

			const params = new URLSearchParams(redirectUrl?.split('#')[1])
			const token = params.get('access_token')

			if (token) {
				const [err, response] = await safeAwait<AxiosError, AuthResponse>(
					googleSignInMutation.mutateAsync({
						token,
						referralCode: undefined,
					})
				)
				if (err) {
					return showToast(translateError(err) as string, 'error')
				}

				if (response.isNewUser) {
					callEvent('openWizardModal')
					await sleep(300)
				}

				login(response.data)
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<button
			type="button"
			onClick={loginGoogle}
			disabled={isLoading}
			className="w-full h-11 px-4 rounded-xl text-xs md:text-sm font-medium flex items-center justify-center border border-base-300/80 bg-base-100 hover:bg-base-200/80 active:scale-[0.99] transition-all duration-150 gap-2.5 cursor-pointer text-content shadow-xs"
		>
			<div className="relative flex items-center justify-center shrink-0">
				{isLoading ? (
					<IconLoading className="!h-4 !w-4" />
				) : (
					<img
						src="https://cdn.widgetify.ir/sites/google.png"
						alt=""
						aria-hidden="true"
						className="w-4 h-4"
					/>
				)}
			</div>
			<span>
				{isLoading ? 'درحال ورود...' : 'ورود با حساب گوگل'}
			</span>
		</button>
	)
}
