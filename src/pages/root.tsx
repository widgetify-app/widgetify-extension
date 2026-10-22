import { useState } from 'react'
import Analytics from '@/analytics'
import { purgeDeprecatedStorageKeys } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { StackedToaster } from '@/components/ui'
import { GeneralSettingProvider } from '@/context/general-setting.context'
import { AccountContactProvider } from '@/features/setting/account/account-contact.context'
import { PartnerAccessProvider } from '@/features/widgets/partner-access.context'
import {
	FreeWidgetProvider,
	type WidgetSlotsTab,
} from '@/features/widgets/widgets.context'
import { NavbarLayout } from '@/features/navbar/navbar'
import { WidgetSettings } from '@/features/widgets/widget-settings/widget-settings'
import { AddWidgetModal } from '@/features/widgets/catalog/catalog'
import { WidgetSlotsModal } from '@/features/widgets/slots/slots'
import { Page, usePage } from '@/context/page.context'
import { Motion as motion, MotionPreferences, Presence } from '@/common/motion'
import { AuthRequiredModal } from '@/components/auth/auth-required-modal'
import { MiniAppPage } from '@/pages/mini-apps/mini-apps.page'
import { ExplorerPage } from '@/pages/explorer/explorer.page'
import { HomePage } from '@/pages/home/home.page'
import { useEffect } from 'react'
import { useSyncClock } from '@/services/date/sync-clock.hook'
import { useBlockBrowserContextMenu } from '@/pages/hooks/use-block-browser-context-menu'
import { useWallpaperApply } from '@/pages/hooks/use-wallpaper-apply'
import { WallpaperProvider } from '@/context/wallpaper.context'

export function RootLayout() {
	useWallpaperApply()
	useBlockBrowserContextMenu()
	useSyncClock()

	useEffect(() => {
		purgeDeprecatedStorageKeys()
	}, [])

	return (
		<>
			<div className="w-full min-h-screen mx-auto md:px-4 lg:px-0 max-w-[1080px] flex flex-col h-screen overflow-y-auto scrollbar-none">
				<GeneralSettingProvider>
					<WallpaperProvider>
						<Main></Main>
					</WallpaperProvider>
				</GeneralSettingProvider>
			</div>
			<StackedToaster />
		</>
	)
}

function Main() {
	const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false)
	const [addWidgetEditTarget, setAddWidgetEditTarget] = useState<any>(null)
	const [addWidgetReturnsToSettings, setAddWidgetReturnsToSettings] = useState(false)
	const [addWidgetFocusId, setAddWidgetFocusId] = useState<string | null>(null)
	const [miniAppFocusId, setMiniAppFocusId] = useState<string | null>(null)
	const [showAuthRequired, setAuthRequired] = useState(false)
	const [isSlotsModalOpen, setIsSlotsModalOpen] = useState(false)
	const [slotsModalTab, setSlotsModalTab] = useState<WidgetSlotsTab>('slots')
	const { page, setPage } = usePage()

	useEffect(() => {
		const openAddModalEvent = listenEvent(
			'openAddCustomWidgetModal',
			(payload?: any) => {
				setPage(Page.Home)
				if (payload?.instanceId && payload?.widgetId) {
					setAddWidgetEditTarget(payload)
				} else {
					setAddWidgetEditTarget(null)
				}
				setAddWidgetFocusId(null)
				setAddWidgetReturnsToSettings(Boolean(payload?.returnToSettings))
				setIsAddWidgetModalOpen(true)
				Analytics.event('widget_catalog_opened')
			}
		)

		const openCatalogEvent = listenEvent('openWidgetCatalog', (widgetKey) => {
			setPage(Page.Home)
			setAddWidgetEditTarget(null)
			setAddWidgetReturnsToSettings(false)
			setAddWidgetFocusId(typeof widgetKey === 'string' ? widgetKey : null)
			setIsAddWidgetModalOpen(true)
			Analytics.event('widget_catalog_opened')
		})

		const openMiniAppEvent = listenEvent('openMiniApp', (appId) => {
			setMiniAppFocusId(typeof appId === 'string' ? appId : null)
			setPage(Page.MiniApps)
		})

		const openAuthRequireModal = listenEvent('open_require_auth_modal', () => {
			setAuthRequired(true)
		})

		const openSlotsModalEvent = listenEvent('openWidgetSlotsModal', (tab) => {
			setPage(Page.Home)
			setSlotsModalTab(tab === 'presets' ? 'presets' : 'slots')
			setIsSlotsModalOpen(true)
		})

		Analytics.pageView('Home', '/')

		return () => {
			openAddModalEvent()
			openCatalogEvent()
			openMiniAppEvent()
			openAuthRequireModal()
			openSlotsModalEvent()
		}
	}, [setPage])

	return (
		<MotionPreferences>
			<AccountContactProvider>
				<PartnerAccessProvider>
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
									<MiniAppPage
										focusAppId={miniAppFocusId}
										onFocusHandled={() => setMiniAppFocusId(null)}
									/>
								)}
							</motion.div>
						</Presence>
						<WidgetSettings />
						<AddWidgetModal
							isOpen={isAddWidgetModalOpen}
							editTarget={addWidgetEditTarget}
							focusWidgetId={addWidgetFocusId}
							onClose={() => {
								setIsAddWidgetModalOpen(false)
								setAddWidgetEditTarget(null)
								setAddWidgetFocusId(null)
							}}
							returnsToSettings={addWidgetReturnsToSettings}
						/>
						<WidgetSlotsModal
							isOpen={isSlotsModalOpen}
							tab={slotsModalTab}
							onTabChange={setSlotsModalTab}
							onClose={() => setIsSlotsModalOpen(false)}
						/>
					</FreeWidgetProvider>
				</PartnerAccessProvider>
			</AccountContactProvider>

			<AuthRequiredModal
				isOpen={showAuthRequired}
				onClose={() => setAuthRequired(false)}
			/>
		</MotionPreferences>
	)
}
