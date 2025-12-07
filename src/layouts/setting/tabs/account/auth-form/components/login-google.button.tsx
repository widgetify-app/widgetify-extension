import { IconLoading } from '@/components/loading/icon-loading'
import { useState } from 'react'

interface LoginGoogleButtonProps {
	onLoginSuccess?: () => void
}

export function LoginGoogleButton({ onLoginSuccess }: LoginGoogleButtonProps) {
	const [isLoading, setIsLoading] = useState(false)

	const loginGoogle = async () => {
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
			console.log('Redirect URI:', redirectUri)
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
				url: url.toString(), // لینک OAuth گوگل
				interactive: true,
			})

			const params = new URLSearchParams(redirectUrl?.split('#')[1])
			const token = params.get('access_token')
			console.log('Access Token:', token)

			if (token) {
				// setGoogleToken(token)
				// setShowReferralModal(true)
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
			className="group px-8 py-2.5 rounded-xl font-medium shadow-lg h-full w-full flex items-center justify-center border-2 border-content bg-content hover:bg-gray-100 transition-colors gap-2 cursor-pointer"
		>
			<div className="relative flex items-center justify-center">
				{isLoading ? (
					<IconLoading className="!h-5 !w-5" />
				) : (
					<img
						src="https://cdn.widgetify.ir/sites/google.png"
						alt="Google Logo"
						className="w-5 h-5 transition-all duration-200 group-hover:scale-110 group-hover:rotate-3"
					/>
				)}
			</div>
			<span className="transition-all duration-200 group-hover:scale-105">
				{isLoading ? 'درحال پردازش...' : 'ورود با گوگل'}
			</span>
		</button>
	)
}
