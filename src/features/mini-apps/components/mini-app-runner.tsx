import { useEffect, useRef, useState } from 'react'
import { useLaunchMiniApp } from '@/services/mini-apps/launch-mini-app.hook'
import { useGetMiniApp } from '@/services/mini-apps/get-mini-app.hook'
import { MiniAppError } from './mini-app-error'
import { MiniAppLoadingState } from './mini-app-loading'
import { MiniAppRunnerHeader } from './runner-header'
import { MiniAppIframe } from './mini-app-iframe-runner'
import { WebAppAuthGate } from './mini-app-auth'
import { Spinner } from '@/components/ui'
import { cn } from '@/common/utils/cn'
const LOAD_TIMEOUT = 8000

interface Prop {
	appId: string
	onClickToExist?: () => void
	onOpenInWindow?: () => void
	isFullScreen: boolean
}
export function MiniAppRunner({
	appId,
	onClickToExist,
	onOpenInWindow,
	isFullScreen,
}: Prop) {
	const isPopup = !onClickToExist
	const timeoutRef = useRef<any>(null)
	const iframeRef = useRef<HTMLIFrameElement>(null)

	const [isAppReady, setIsAppReady] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [userConfirmedScopes, setUserConfirmedScopes] = useState(false)
	const [launchData, setLaunchData] = useState<{
		launchUrl: string
		origin: string
		data: string
		signature: string
	} | null>(null)

	const { data: appData, isLoading: isLoadingApp } = useGetMiniApp(appId)
	const { mutateAsync: launchApp, isPending: isLaunching } = useLaunchMiniApp()

	const app = appData?.data

	const doLaunch = async () => {
		setHasError(false)
		setIsAppReady(false)
		setLaunchData(null)
		try {
			const response = await launchApp({ appId })
			setLaunchData(response.data)
		} catch (error) {
			console.error('Error launching app:', error)
			setHasError(true)
		}
	}

	const handleConfirmScopes = () => {
		setUserConfirmedScopes(true)
		doLaunch()
	}

	const clearTimer = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
	}

	const startTimer = () => {
		clearTimer()
		timeoutRef.current = setTimeout(() => {
			setIsAppReady(false)
			setLaunchData(null)
			setHasError(true)
		}, app?.timeout || LOAD_TIMEOUT)
	}

	useEffect(() => {
		if (!app) return

		if (app.scopes.length === 0 || app.isLaunchedByUser) {
			handleConfirmScopes()
		} // without permission
		else setUserConfirmedScopes(false)
	}, [app, appId])

	useEffect(() => {
		if (!launchData) return

		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== launchData.origin) return
			if (event.data?.type !== 'WIDGETIFY_APP_READY') return
			clearTimer()

			iframeRef.current?.contentWindow?.postMessage(
				{
					type: 'WIDGETIFY_AUTH',
					payload: {
						data: launchData.data,
						signature: launchData.signature,
					},
				},
				launchData.origin
			)

			setIsAppReady(true)
		}
		startTimer()

		window.addEventListener('message', handleMessage)
		return () => {
			window.removeEventListener('message', handleMessage)
			clearTimer()
		}
	}, [launchData])

	const handleReload = () => {
		doLaunch()
	}

	const onClickToBack = () => {
		clearTimer()
		onClickToExist?.()
	}

	const isLoading = isLoadingApp || isLaunching
	const isConnecting = !isLoading && !!launchData && !isAppReady && !hasError

	const shouldShowAuthGate =
		app?.scopes &&
		app.scopes.length > 0 &&
		!userConfirmedScopes &&
		!appData?.data.isLaunchedByUser

	return (
		<div className={cn('flex flex-col w-full h-full', !isPopup && 'rounded-l-2xl!')}>
			{!isPopup && (
				<MiniAppRunnerHeader
					app={app}
					handleReload={handleReload}
					onClickToBack={onClickToBack}
					onOpenInWindow={onOpenInWindow}
					isConnecting={isConnecting}
					isLoading={isLoading}
					isLoadingApp={isLoadingApp}
				/>
			)}

			<div
				className={cn(
					'relative flex-1 overflow-hidden',
					!isPopup && (isFullScreen ? 'rounded-b-2xl' : 'rounded-bl-2xl')
				)}
			>
				{isLoading && (
					<MiniAppLoadingState
						icon={app?.icon}
						name={app?.name}
						label={`در حال اجرای ${app?.name || 'برنامک'}...`}
						labelIcon={
							<Spinner size="sm" aria-hidden="true" className="ml-1" />
						}
					/>
				)}

				{shouldShowAuthGate && (
					<WebAppAuthGate scopes={app.scopes} onConfirm={handleConfirmScopes} />
				)}

				{/* wait WIDGETIFY_APP_READY */}
				{isConnecting && !shouldShowAuthGate && (
					<MiniAppLoadingState
						icon={app?.icon}
						name={app?.name}
						label={`در حال اتصال به ${app?.name || 'برنامک'}...`}
						labelIcon={
							<Spinner size="sm" aria-hidden="true" className="ml-1" />
						}
					/>
				)}

				{hasError && !shouldShowAuthGate && !isLoading && (
					<MiniAppError
						handleReload={handleReload}
						onClickToBack={onClickToExist && onClickToBack}
					/>
				)}

				{launchData &&
					app &&
					!hasError &&
					(userConfirmedScopes || app.scopes.length === 0) && (
						<MiniAppIframe
							appName={app?.name}
							launchUrl={app?.launchUrl}
							ref={iframeRef}
							isAppReady={isAppReady}
							allowPermission={app.allowPermission}
							sandboxPermission={app.sandboxPermission}
						/>
					)}
			</div>
		</div>
	)
}
