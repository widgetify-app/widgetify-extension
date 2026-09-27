import { useState } from 'react'
import Analytics from '@/analytics'
import { purgeDeprecatedStorageKeys } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { StackedToaster } from '@/components/ui'
import {
	GeneralSettingProvider,
	useGeneralSetting,
} from '@/context/general-setting.context'
import { FreeWidgetProvider } from '@/context/free-widget/free-widget.context'
import { NavbarLayout } from '@/features/navbar/navbar'
import { WidgetTabKeys } from '@/features/widgets/widget-settings/constants'
import { WidgetSettingsModal } from '@/features/widgets/widget-settings/widget-settings'
import { Page, usePage } from '@/context/page.context'
import { MotionConfig } from 'framer-motion'
import { Motion as motion, Presence } from '@/common/motion'
import { AuthRequiredModal } from '@/components/auth/auth-required-modal'
import { MiniAppPage } from '@/pages/mini-apps/mini-apps.page'
import { ExplorerPage } from '@/pages/explorer/explorer.page'
import { HomePage } from '@/pages/home/home.page'
import { useEffect } from 'react'
import { useWallpaperApply } from '@/features/setting/wallpapers/hooks/use-wallpaper-apply'
import { WallpaperProvider } from '@/context/wallpaper.context'
import { IconProvider } from '@/icons'

export function RootLayout() {
	useWallpaperApply()

	useEffect(() => {
		purgeDeprecatedStorageKeys()
	}, [])

	return (
		<IconProvider defaultTheme="default">
			<div className="w-full min-h-screen mx-auto md:px-4 lg:px-0 max-w-[1080px] flex flex-col h-screen overflow-y-auto scrollbar-none">
				<GeneralSettingProvider>
					<WallpaperProvider>
						<Main></Main>
					</WallpaperProvider>
				</GeneralSettingProvider>
			</div>
			<StackedToaster />
		</IconProvider>
	)
}

function Main() {
	const [activeSettingPayload, setActiveSettingPayload] = useState<{
		tab: WidgetTabKeys | null
		instanceId?: string
		size?: { w: number; h: number }
	} | null>(null)
	const [showAuthRequired, setAuthRequired] = useState(false)
	const { page } = usePage()
	const { isOptimalMode } = useGeneralSetting()

	useEffect(() => {
		const openWidgetsSettingsEvent = listenEvent(
			'openWidgetsSettings',
			(data: {
				tab: WidgetTabKeys | null
				instanceId?: string
				size?: { w: number; h: number }
			}) => {
				if (!data.tab || data.tab === WidgetTabKeys.widget_management) {
					callEvent('openAddCustomWidgetModal')
				} else {
					setActiveSettingPayload(data)
				}
			}
		)

		const openAuthRequireModal = listenEvent('open_require_auth_modal', () => {
			setAuthRequired(true)
		})

		Analytics.pageView('Home', '/')

		return () => {
			openWidgetsSettingsEvent()
			openAuthRequireModal()
		}
	}, [])

	return (
		<MotionConfig reducedMotion={isOptimalMode ? 'always' : 'never'}>
			<FreeWidgetProvider>
				<NavbarLayout />

				<Presence mode="wait">
					<motion.div
						key={page}
						initial={{ y: 10 }}
						animate={{ y: 0 }}
						exit={{ y: 10 }}
						transition={{
							duration: 0.2,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="flex w-full h-full"
					>
						{page === Page.Home ? (
							<HomePage />
						) : page === Page.Explorer ? (
							<ExplorerPage />
						) : (
							<MiniAppPage />
						)}
					</motion.div>
				</Presence>
				<WidgetSettingsModal
					onClose={() => setActiveSettingPayload(null)}
					selectedTab={null}
					activeSettingTab={activeSettingPayload?.tab}
					instanceId={activeSettingPayload?.instanceId}
					size={activeSettingPayload?.size}
					onCloseSetting={() => setActiveSettingPayload(null)}
				/>
			</FreeWidgetProvider>

			<AuthRequiredModal
				isOpen={showAuthRequired}
				onClose={() => setAuthRequired(false)}
			/>
		</MotionConfig>
	)
}
