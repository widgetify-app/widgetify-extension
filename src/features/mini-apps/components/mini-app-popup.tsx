import { useEffect } from 'react'
import { useGetMiniApp } from '@/services/mini-apps/get-mini-app.hook'
import { MiniAppRunner } from './mini-app-runner'

export function MiniAppPopup() {
	const appId = new URLSearchParams(window.location.search).get('appId') ?? ''
	const { data } = useGetMiniApp(appId)
	const name = data?.data.name

	useEffect(() => {
		if (name) document.title = name
	}, [name])

	return (
		<div className="w-screen h-screen bg-surface text-fg">
			<MiniAppRunner appId={appId} isFullScreen />
		</div>
	)
}
