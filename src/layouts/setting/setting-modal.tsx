import { useEffect, useState } from 'react'
import { GoTable } from 'react-icons/go'
import { MdOutlinePrivacyTip } from 'react-icons/md'
import { TbApps } from 'react-icons/tb'
import {
	VscAccount,
	VscColorMode,
	VscInfo,
	VscMegaphone,
	VscPaintcan,
	VscRecordKeys,
	VscSettingsGear,
} from 'react-icons/vsc'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import Modal from '@/components/modal'
import { type TabItem, TabManager } from '@/components/tab-manager'
import { UpdateReleaseNotesModal } from '@/components/UpdateReleaseNotesModal'
import { AboutUsTab } from './tabs/about-us/about-us'
import { AccountTab } from './tabs/account/account'
import { AppearanceSettingTab } from './tabs/appearance/appearance'
import { GeneralSettingTab } from './tabs/general/general'
import { PrivacySettings } from './tabs/privacy/privacy-settings'
import { ShortcutsTab } from './tabs/shortcuts/shortcuts'
import { VerticalTabsTab } from './tabs/vertical-tabs/vertical-tabs-settings'
import { WallpaperSetting } from './tabs/wallpapers/wallpapers'

interface SettingModalProps {
	isOpen: boolean
	onClose: () => void
	selectedTab: string | null
}
const tabs: TabItem[] = [
	{
		label: 'عمومی',
		value: 'general',
		icon: <VscSettingsGear size={20} />,
		element: <GeneralSettingTab />,
	},
	{
		label: 'حساب کاربری',
		value: 'account',
		icon: <VscAccount size={20} />,
		element: <AccountTab />,
	},
	{
		label: 'حریم خصوصی',
		value: 'access',
		icon: <MdOutlinePrivacyTip size={20} />,
		element: <PrivacySettings key="privacy" />,
	},
	{
		label: 'ظاهری',
		value: 'appearance',
		icon: <VscColorMode size={20} />,
		element: <AppearanceSettingTab />,
	},
	{
		label: (
			<div className="flex items-center gap-0.5">
				<span>منوی کناری </span>
				<span className="hidden text-white badge badge-primary badge-xs md:inline">
					جدید
				</span>
			</div>
		),
		value: 'tab-management',
		icon: <GoTable size={20} />,
		element: <VerticalTabsTab />,
	},
	{
		label: 'تصویر زمینه',
		value: 'wallpapers',
		icon: <VscPaintcan size={20} />,
		element: <WallpaperSetting />,
	},
	{
		label: 'میانبرها',
		value: 'shortcuts',
		icon: <VscRecordKeys size={20} />,
		element: <ShortcutsTab />,
	},
	{
		label: 'درباره ما',
		value: 'about',
		icon: <VscInfo size={20} />,
		element: <AboutUsTab />,
	},
]
export const SettingModal = ({ isOpen, onClose, selectedTab }: SettingModalProps) => {
	const [isUpdateModalOpen, setUpdateModalOpen] = useState(false)

	function openWidgetSettings() {
		onClose()
		Analytics.event('open_widgets_settings_from_settings_modal')
		callEvent('openWidgetsSettings')
	}

	useEffect(() => {
		if (isOpen) {
			Analytics.event('open_settings_modal', {
				selected_tab: selectedTab,
			})
		}
	}, [isOpen])

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="xl"
			title="تنظیمات"
			direction="rtl"
		>
			<TabManager
				tabOwner="setting"
				tabs={tabs}
				defaultTab="general"
				selectedTab={selectedTab}
				direction="rtl"
			/>
			<button
				className={`relative  items-center hidden md:flex gap-3 px-4 py-3 rounded-full transition-all duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] text-muted hover:bg-base-300 w-42`}
				onClick={() => openWidgetSettings()}
			>
				<TbApps size={20} className="text-muted" />
				<span className="text-sm font-light">مدیریت ویجت ها</span>
				<span className="absolute w-2 h-2 rounded-full right-4 top-2 bg-error animate-pulse"></span>
			</button>
			<button
				className={`relative  items-center hidden md:flex gap-3 px-4 py-3 rounded-full transition-all duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] text-muted hover:bg-base-300 w-42`}
				onClick={() => setUpdateModalOpen(true)}
			>
				<VscMegaphone size={20} />
				<span className="text-sm font-light">تغییرات اخیر</span>
			</button>
			<UpdateReleaseNotesModal
				isOpen={isUpdateModalOpen}
				onClose={() => setUpdateModalOpen(false)}
				counterValue={null}
			/>
		</Modal>
	)
}
