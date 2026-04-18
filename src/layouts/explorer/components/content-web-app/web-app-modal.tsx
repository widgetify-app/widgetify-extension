import { useAppearanceSetting } from '@/context/appearance.context'
import { useTheme } from '@/context/theme.context'
import type { CatalogItem } from '../../interfaces/catalog-item.interface'
import Modal from '@/components/modal'
import { CiCircleAlert } from 'react-icons/ci'
import { Button } from '@/components/button/button'
import { LuRefreshCw } from 'react-icons/lu'
import { useAuth } from '@/context/auth.context'
import { useEffect, useRef, useState } from 'react'
import { WebAppAuthGate } from './content-web-app.auth'
import { WebAppStartGate } from './content-web-app.start'
import Analytics from '@/analytics'

interface Prop {
	content: CatalogItem
	showModal: boolean
	onClose: () => void
}

const LOAD_TIMEOUT = 8000

export function WebAppModal({ content, showModal, onClose }: Prop) {
	const { isAuthenticated } = useAuth()

	const [isLoading, setIsLoading] = useState(false)
	const [iframeLoaded, setIframeLoaded] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [reloadKey, setReloadKey] = useState(0)
	const [hasStarted, setHasStarted] = useState(false)

	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	const { fontFamily } = useAppearanceSetting()
	const { theme } = useTheme()

	const requiresAuth = content?.webAppAuthRequired === true

	const urlObj = new URL(content.url)
	urlObj.searchParams.set('theme', encodeURIComponent(theme))
	urlObj.searchParams.set('font', encodeURIComponent(fontFamily))
	urlObj.searchParams.set('referrer', 'extension')
	const url = urlObj.toString()

	const clearTimer = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
	}

	const startTimer = () => {
		clearTimer()
		timeoutRef.current = setTimeout(() => {
			setIsLoading(false)
			setHasError(true)
		}, LOAD_TIMEOUT)
	}

	const startLoading = () => {
		setIsLoading(true)
		setHasError(false)
		setIframeLoaded(false)
		setHasStarted(true)
		startTimer()
	}

	useEffect(() => {
		const handler = (event: MessageEvent) => {
			if (event.data?.type === 'WIDGETIFY_APP_READY') {
				clearTimer()
				setIframeLoaded(true)
				setIsLoading(false)
			}
		}

		if (!showModal) return

		setIsLoading(false)
		setHasError(false)
		setIframeLoaded(false)
		setHasStarted(false)

		if (!requiresAuth) {
			startLoading()
		}

		window.addEventListener('message', handler)

		return () => {
			window.removeEventListener('message', handler)
			clearTimer()
		}
	}, [showModal])

	const handleRun = () => {
		startLoading()
		Analytics.event('web_app_run')
	}

	const handleRetry = () => {
		setReloadKey((p) => p + 1)
		startLoading()
		Analytics.event('web_app_retry')
	}

	const handleModalClose = () => {
		onClose()
		setIsLoading(false)
		setIframeLoaded(false)
		setHasError(false)
		setHasStarted(false)
		clearTimer()
		Analytics.event('web_app_modal_closed')
	}

	return (
		<Modal
			isOpen={showModal}
			onClose={handleModalClose}
			title={
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold">{content.name}</span>
					<span className="px-1.5 py-0.5 text-xs rounded-md bg-primary text-white/90">
						بتا
					</span>
				</div>
			}
			direction="rtl"
			closeOnBackdropClick={false}
			showCloseButton
			size="full"
		>
			<div className="relative w-full h-full">
				{requiresAuth && !isAuthenticated && <WebAppAuthGate />}

				{requiresAuth && isAuthenticated && !hasStarted && (
					<WebAppStartGate onRun={handleRun} />
				)}

				{isLoading && !iframeLoaded && !hasError && (
					<div className="absolute inset-0 flex items-center justify-center p-6">
						<div className="flex flex-col items-center w-full max-w-md gap-6 p-5 text-center border shadow-xs rounded-2xl bg-base-100 border-base-300">
							<div className="relative">
								<div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md animate-pulse" />
								<div className="relative flex items-center justify-center w-20 h-20 p-4 rounded-2xl bg-base-200">
									<img
										src={content.icon}
										className="object-contain w-full h-full"
									/>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" />
								<div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" />
								<div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" />
							</div>

							<p className="text-sm">در حال اتصال به {content.name} ...</p>
						</div>
					</div>
				)}

				{hasError && (
					<div className="absolute inset-0 flex items-center justify-center p-6">
						<div className="flex flex-col items-center w-full max-w-md gap-5 p-5 text-center border shadow-xs rounded-2xl bg-base-100 border-base-300">
							<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-error/10">
								<span className="text-lg text-error">
									<CiCircleAlert />
								</span>
							</div>

							<div className="flex flex-col items-center gap-2">
								<p className="text-sm font-semibold">خطا در اتصال</p>
								<p className="max-w-xs text-xs leading-relaxed opacity-60">
									ارتباط با این برنامه برقرار نشد. لطفا دوباره تلاش
									کنید.
								</p>
							</div>

							<Button
								onClick={handleRetry}
								size="sm"
								isPrimary
								className="w-full"
								rounded="xl"
							>
								<LuRefreshCw className="w-4 h-4" />
								تلاش مجدد
							</Button>
						</div>
					</div>
				)}
				{hasStarted && !hasError && (
					<iframe
						key={reloadKey}
						src={url}
						title={content.name || content.url}
						style={{
							width: '100%',
							height: '90%',
							border: 'none',
							opacity: iframeLoaded ? 1 : 0,
							transition: 'opacity 0.3s ease',
						}}
					/>
				)}
			</div>
		</Modal>
	)
}
