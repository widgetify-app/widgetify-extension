import { MiniAppsLayout } from '@/features/mini-apps/mini-apps'

interface Prop {
	focusAppId?: string | null
	onFocusHandled?: () => void
}

export function MiniAppPage({ focusAppId, onFocusHandled }: Prop) {
	return <MiniAppsLayout focusAppId={focusAppId} onFocusHandled={onFocusHandled} />
}
