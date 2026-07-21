import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Analytics from '@/analytics'
import { listenEvent } from '@/common/utils/call-event'
import {
	GeneralSettingProvider,
	useGeneralSetting,
} from '@/context/general-setting.context'
import { WidgetVisibilityProvider } from '@/context/widget-visibility.context'
import { NavbarLayout } from '@/layouts/navbar/navbar.layout'
import type { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { WidgetSettingsModal } from '@/layouts/widgets-settings/widget-settings-modal'
import { Page, usePage } from '@/context/page.context'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import { MiniAppPage } from './mini-apps/mini-app.page'
import { ExplorerPage } from './explorer/explorer.pge'
import { HomePage } from './home/home.page'
import { useEffect } from 'react'
import { useWallpaperApply } from '@/layouts/setting/tabs/wallpapers/hooks/use-wallpaper-apply'
import { WallpaperProvider } from '@/context/wallpaper.context'
import { IconProvider } from '../icons/icons.context'

export function RootLayout() {
	useWallpaperApply()

	return (
		<div className="w-full min-h-screen mx-auto md:px-4 lg:px-0 max-w-[1080px] flex flex-col h-[100vh] overflow-y-auto scrollbar-none">
			<IconProvider defaultTheme="default">
				<GeneralSettingProvider>
					<WallpaperProvider>
						<Main></Main>
					</WallpaperProvider>
				</GeneralSettingProvider>
				<Toaster
					toastOptions={{
						error: {
							style: {
								backgroundColor: '#f8d7da',
								color: '#721c24',
							},
						},
						success: {
							style: {
								backgroundColor: '#d4edda',
								color: '#155724',
							},
						},
						duration: 5000,
					}}
				/>
				{/* <UpdateChecker /> */}
			</IconProvider>
		</div>
	)
}

function Main() {
	const [showWidgetSettings, setShowWidgetSettings] = useState(false)
	const [showAuthRequired, setAuthRequired] = useState(false)
	const [tab, setTab] = useState<string | null>(null)
	const { page } = usePage()
	const { isOptimalMode } = useGeneralSetting()

	useEffect(() => {
		const openWidgetsSettingsEvent = listenEvent(
			'openWidgetsSettings',
			(data: { tab: WidgetTabKeys | null }) => {
				setShowWidgetSettings(true)
				if (data.tab) setTab(data.tab)
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
			<WidgetVisibilityProvider>
				<NavbarLayout />

				<AnimatePresence mode="wait">
					<motion.div
						key={page}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 0.15,
							ease: 'linear',
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
				</AnimatePresence>
				<WidgetSettingsModal
					isOpen={showWidgetSettings}
					onClose={() => {
						setShowWidgetSettings(false)
						setTab(null)
					}}
					selectedTab={tab}
				/>
			</WidgetVisibilityProvider>

			{showAuthRequired && (
				<AuthRequiredModal
					isOpen={showAuthRequired}
					onClose={() => setAuthRequired(false)}
				/>
			)}
		</MotionConfig>
	)
}
