import { useEffect, useRef, useState } from 'react'
import { useLaunchMiniApp } from '@/services/hooks/mini-apps/launch-mini-app.hook'
import { useGetMiniApp } from '@/services/hooks/mini-apps/get-mini-app.hook'
import { MiniAppError } from './states/mini-app-error'
import { MiniAppLoadingState } from './states/mini-app-loading'
import { MiniAppRunnerHeader } from './components/header/runner.header'
import { MiniAppIframe } from './components/runner/mini-app-iframe.runner'
import { WebAppAuthGate } from './states/mini-app.auth'
import { IconLoading } from '@/components/loading/icon-loading'
const LOAD_TIMEOUT = 8000

interface Prop {
	appId: string
	onClickToExist: () => void
}
export function MiniAppRunner({ appId, onClickToExist }: Prop) {
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
		}, LOAD_TIMEOUT)
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
		onClickToExist()
	}

	const isLoading = isLoadingApp || isLaunching
	const isConnecting = !isLoading && !!launchData && !isAppReady && !hasError

	const shouldShowAuthGate =
		app?.scopes &&
		app.scopes.length > 0 &&
		!userConfirmedScopes &&
		!appData?.data.isLaunchedByUser

	return (
		<div className="flex flex-col w-full h-full  rounded-l-2xl!">
			<MiniAppRunnerHeader
				app={app}
				handleReload={handleReload}
				onClickToBack={() => onClickToBack()}
				isConnecting={isConnecting}
				isLoading={isLoading}
				isLoadingApp={isLoadingApp}
			/>

			<div className="relative flex-1 overflow-hidden rounded-b-2xl">
				{isLoading && (
					<MiniAppLoadingState
						icon={app?.icon}
						name={app?.name}
						label={`در حال اجرای ${app?.name || 'برنامک'}...`}
						labelIcon={<IconLoading className="ml-1!" />}
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
						labelIcon={<IconLoading className="ml-1!" />}
					/>
				)}

				{hasError && !shouldShowAuthGate && !isLoading && (
					<MiniAppError
						handleReload={handleReload}
						onClickToBack={() => onClickToBack()}
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
