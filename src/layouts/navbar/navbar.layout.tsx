import { type JSX, useCallback, useEffect, useState } from 'react'
import { HiX } from 'react-icons/hi'
import { FiChevronDown } from 'react-icons/fi'
import { HiHome } from 'react-icons/hi'
import { AiOutlineDrag } from 'react-icons/ai'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent, callEvent } from '@/common/utils/call-event'
import { getConfigData } from '@/services/config-data/config_data-api'
import { SettingModal } from '../setting/setting-modal'
import { SettingsDropdown } from './components/settingsDropdown'
import { FriendsList } from './friends-list/friends'
import { ProfileNav } from './profile/profile'
import { SyncButton } from './sync/sync'
import { useAppearanceSetting } from '@/context/appearance.context'
import { MarketButton } from './market/market-button'
import Analytics from '@/analytics'

interface LogoData {
	logoUrl: string | null
	content: string | null
}

const DEFAULT_LOGO_DATA: LogoData = {
	logoUrl: null,
	content: '<h1 class="text-xl text-gray-100">ویجتی‌فای</h1>',
}

const WIDGETIFY_URLS = {
	website: 'https://widgetify.ir',
} as const

export function NavbarLayout(): JSX.Element {
	const { canReOrderWidget, toggleCanReOrderWidget } = useAppearanceSetting()
	const [showSettings, setShowSettings] = useState(false)
	const [isVisible, setIsVisible] = useState(true)
	const [tab, setTab] = useState<string | null>(null)
	const [logoData, setLogoData] = useState<LogoData>(DEFAULT_LOGO_DATA)

	const handleOpenSettings = useCallback(
		(tabName: 'account' | 'wallpapers' | 'general' | null) => {
			if (tabName) setTab(tabName)
			setShowSettings(true)
		},
		[]
	)

	const onToggleNavbar = () => {
		setIsVisible((prev) => !prev)
		Analytics.event(`navbar_${isVisible ? 'closed' : 'opened'}`)
	}

	const settingsModalCloseHandler = () => setShowSettings(false)

	const sanitizeAndUpdateLogo = useCallback(
		(logoUrl: string | null, logoId: string, storeData: any) => {
			const newLogoData = { content: '', logoUrl }
			setLogoData(newLogoData)
			return setToStorage('configData', {
				...storeData,
				logo: { id: logoId, content: '', logoUrl: logoUrl },
			})
		},
		[]
	)

	const loadConfig = useCallback(async () => {
		try {
			const storeData = await getFromStorage('configData')
			if (storeData?.logo) {
				setLogoData({
					content: storeData.logo.content,
					logoUrl: storeData.logo.logoUrl,
				})
			}
			const data = await getConfigData()
			if (data.logo?.logoUrl) {
				await sanitizeAndUpdateLogo(data.logo.logoUrl, data.logo.id, storeData)
			}
		} catch {}
	}, [sanitizeAndUpdateLogo])

	useEffect(() => {
		const openSettingEvent = listenEvent('openSettings', handleOpenSettings)
		loadConfig()
		return () => openSettingEvent()
	}, [handleOpenSettings, loadConfig])

	return (
		<>
			{canReOrderWidget && (
				<div className="fixed z-[100] transform -translate-x-1/2 top-4 left-1/2 w-max">
					<div className="px-4 py-2 border shadow-2xl shadow-warning bg-warning border-warning rounded-2xl">
						<div className="flex items-center gap-3 text-xs font-bold text-warning-content">
							<AiOutlineDrag
								size={16}
								className="animate-bounce text-warning"
							/>
							<span>حالت جابجایی فعال، ویجت هارو جابجا کنید</span>
							<button
								onClick={() => toggleCanReOrderWidget()}
								className="transition-colors hover:text-red-400"
							>
								<HiX size={16} />
							</button>
						</div>
					</div>
				</div>
			)}

			{!isVisible && (
				<button
					onClick={() => onToggleNavbar()}
					className="fixed z-50 bottom-0 left-1/2 -translate-x-1/2 px-10 py-2.5 bg-white/[0.05] backdrop-blur-[40px] backdrop-saturate-[180%] border-t border-x border-white/10 rounded-t-3xl shadow-[0_-0px_30px_rgba(0,0,0,0.3)] transition-all hover:bg-white/[0.08]"
				>
					<div className="w-10 h-1 rounded-full bg-white/30" />
				</button>
			)}

			<div
				className={`fixed z-50 -translate-x-1/2 left-1/2 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
					isVisible
						? 'bottom-4 opacity-100 scale-100'
						: '-bottom-32 opacity-0 scale-95 pointer-events-none'
				}`}
			>
				<nav className="relative flex items-center gap-1 p-1.5 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-[2.5rem]">
					<button
						onClick={() => onToggleNavbar()}
						className="relative z-10 p-2 transition-colors cursor-pointer text-white/20 hover:text-white/40"
					>
						<FiChevronDown size={18} />
					</button>

					<div className="relative z-10 w-[1px] h-6 bg-white/[0.08]" />

					<div className="relative z-10 flex items-center gap-0.5">
						<ProfileNav />
						<SyncButton />
						<FriendsList />
					</div>

					<div className="relative z-10 w-[1px] h-6 bg-white/[0.08]" />

					<div className="relative z-10 flex items-center gap-0.5">
						<MarketButton />

						<SettingsDropdown setShowSettings={setShowSettings} />
					</div>

					<div className="relative z-10 w-[1px] h-6 bg-white/[0.08]" />

					<div className="relative z-10 flex items-center gap-2 pr-1 ml-0.5">
						<button
							onClick={() => callEvent('closeJumpPage')}
							className="relative p-2 transition-all rounded-full text-white bg-primary shadow-[0_5px_15px_rgba(var(--primary-rgb),0.3)] active:scale-90 group"
						>
							<HiHome size={19} />
						</button>
						{logoData.logoUrl && (
							<a
								href={WIDGETIFY_URLS.website}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center w-8 h-8 border rounded-full border-white/10 bg-black/20"
							>
								<img
									src={logoData.logoUrl}
									alt="Logo"
									className="object-contain w-5 h-5 opacity-80"
								/>
							</a>
						)}
					</div>
				</nav>
			</div>

			<SettingModal
				isOpen={showSettings}
				onClose={settingsModalCloseHandler}
				selectedTab={tab}
			/>
		</>
	)
}
