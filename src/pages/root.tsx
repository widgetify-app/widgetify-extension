import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Analytics from '@/analytics'
import { purgeDeprecatedStorageKeys } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { TOAST_TOP_LAYER_ID } from '@/common/toast'
import { Portal } from '@/components/ui'
import {
	GeneralSettingProvider,
	useGeneralSetting,
} from '@/context/general-setting.context'
import { WidgetVisibilityProvider } from '@/context/widget-visibility.context'
import { FreeWidgetProvider } from '@/context/free-widget/free-widget.context'
import { NavbarLayout } from '@/layouts/navbar/navbar.layout'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { WidgetSettingsModal } from '@/layouts/widgets-settings/widget-settings-modal'
import { Page, usePage } from '@/context/page.context'
import { MotionConfig } from 'framer-motion'
import { Motion as motion, Presence } from '@/common/motion'
import { AuthRequiredModal } from '@/components/auth/auth-required-modal'
import { MiniAppPage } from './mini-apps/mini-app.page'
import { ExplorerPage } from './explorer/explorer.page'
import { HomePage } from './home/home.page'
import { useEffect } from 'react'
import { useWallpaperApply } from '@/layouts/setting/tabs/wallpapers/hooks/use-wallpaper-apply'
import { WallpaperProvider } from '@/context/wallpaper.context'
import { IconProvider } from '../icons/icons.context'

export function RootLayout() {
	useWallpaperApply()

	useEffect(() => {
		purgeDeprecatedStorageKeys()
	}, [])

	return (
		<div className="w-full min-h-screen mx-auto md:px-4 lg:px-0 max-w-[1080px] flex flex-col h-screen overflow-y-auto scrollbar-none">
			<IconProvider defaultTheme="default">
				<GeneralSettingProvider>
					<WallpaperProvider>
						<Main></Main>
					</WallpaperProvider>
				</GeneralSettingProvider>
				<div id={TOAST_TOP_LAYER_ID} className="fixed inset-0 pointer-events-none z-[999999]">
					<Toaster
						toastOptions={{
							error: {
								style: {
									backgroundColor: 'var(--color-error)',
									color: 'var(--color-error-content)',
								},
							},
							success: {
								style: {
									backgroundColor: 'var(--color-success)',
									color: 'var(--color-success-content)',
								},
							},
							duration: 5000,
						}}
					/>
				</div>
			</IconProvider>
		</div>
	)
}

function Main() {
	const [showManageWidgets, setShowManageWidgets] = useState(false)
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
					setShowManageWidgets(true)
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
				<WidgetVisibilityProvider>
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
						isOpen={showManageWidgets}
						onClose={() => setShowManageWidgets(false)}
						selectedTab={null}
						activeSettingTab={activeSettingPayload?.tab}
						instanceId={activeSettingPayload?.instanceId}
						size={activeSettingPayload?.size}
						onCloseSetting={() => setActiveSettingPayload(null)}
					/>
				</WidgetVisibilityProvider>
			</FreeWidgetProvider>

			<AuthRequiredModal
				isOpen={showAuthRequired}
				onClose={() => setAuthRequired(false)}
			/>
		</MotionConfig>
	)
}
