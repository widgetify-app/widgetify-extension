import { useAppearanceSetting } from '@/context/appearance.context'
import { useTheme } from '@/context/theme.context'

interface Prop {
	launchUrl: string
	ref: any
	appName: string
	isAppReady: boolean
}
export function MiniAppIframe({ appName, launchUrl, ref, isAppReady }: Prop) {
	const { fontFamily } = useAppearanceSetting()
	const { theme } = useTheme()
	const urlObj = new URL(launchUrl || '')
	urlObj.searchParams.set('theme', encodeURIComponent(theme))
	urlObj.searchParams.set('font', encodeURIComponent(fontFamily))
	urlObj.searchParams.set('referrer', 'EXTENSION')
	urlObj.searchParams.set('client', 'EXTENSION')
	const url = urlObj.toString()

	return (
		<iframe
			key={url}
			ref={ref}
			src={url}
			className={`w-full h-full border-none transition-opacity duration-300 ${isAppReady ? 'opacity-100' : 'opacity-0'}`}
			title={appName ?? 'مینی‌اپ'}
			allow="camera; microphone; geolocation"
			sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
		/>
	)
}
