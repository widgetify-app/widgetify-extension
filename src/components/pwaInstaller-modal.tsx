import { useEffect, useState } from 'react'

interface PwaInstallerModalProps {
	show: boolean
	onClose: () => void
}

export const PwaInstallerModal = ({ show, onClose }: PwaInstallerModalProps) => {
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
	const [isIos, setIsIos] = useState(false)
	const [isInstalling, setIsInstalling] = useState(false)

	useEffect(() => {
		const userAgent = window.navigator.userAgent.toLowerCase()
		const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
		setIsIos(isIosDevice)

		const handleBeforeInstallPrompt = (e: any) => {
			e.preventDefault()
			setDeferredPrompt(e)
		}

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
		}
	}, [])

	const handleInstallClick = () => {
		if (deferredPrompt) {
			setIsInstalling(true)
			deferredPrompt.prompt()
			deferredPrompt.userChoice.then((choiceResult: any) => {
				setIsInstalling(false)
				if (choiceResult.outcome === 'accepted') {
					console.log('User accepted the install prompt')
				} else {
					console.log('User dismissed the install prompt')
				}
				setDeferredPrompt(null)
			})
		}
	}

	if (!show) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-2xl dark:bg-neutral-800">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						نصب اپلیکیشن
					</h2>
					<button
						onClick={onClose}
						className="w-8 text-2xl text-gray-600 rounded cursor-pointer hover:bg-red-500/80 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
					>
						&times;
					</button>
				</div>
				<div>
					{isIos ? (
						<p className="mb-4 text-gray-700 dark:text-gray-300">
							برای نصب اپلیکیشن ویجتیفای روی دستگاه خود، از دکمه اشتراک‌گذاری در مرورگر
							Safari استفاده کنید و گزینه "Add to Home Screen" را انتخاب کنید.
						</p>
					) : (
						<>
							<p className="mb-4 text-gray-700 dark:text-gray-300">
								برای نصب اپلیکیشن ویجتیفای روی دستگاه خود، روی دکمه زیر کلیک کنید.
							</p>
							<button
								onClick={handleInstallClick}
								className={`w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 ${isInstalling ? 'animate-pulse' : ''}`}
								disabled={isInstalling}
							>
								{isInstalling ? 'در حال نصب...' : 'نصب اپلیکیشن'}
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
