import Modal from '@/components/modal'
import { type TabItem, TabManager } from '@/components/tab-manager'
import {
	VscAccount,
	VscCloud,
	VscColorMode,
	VscInfo,
	VscPaintcan,
	VscRecordKeys,
	VscSettingsGear,
} from 'react-icons/vsc'
import { AboutUsTab } from './tabs/about-us/about-us'
import { AccountTab } from './tabs/account/account'
import { AppearanceSettingTab } from './tabs/appearance/appearance'
import { GeneralSettingTab } from './tabs/general/general'
import { ShortcutsTab } from './tabs/shortcuts/shortcuts'
import { WallpaperSetting } from './tabs/wallpapers/wallpapers'
import { WeatherOptions } from './tabs/weather/weather'

interface SettingModalProps {
	isOpen: boolean
	onClose: () => void
	selectedTab: string | null
}

export const SettingModal = ({ isOpen, onClose, selectedTab }: SettingModalProps) => {
	const tabs: TabItem[] = [
		{
			label: 'عمومی',
			value: 'general',
			icon: <VscSettingsGear size={20} />,
			element: <GeneralSettingTab />,
		},
		{
			label: 'ظاهری',
			value: 'appearance',
			icon: <VscColorMode size={20} />,
			element: <AppearanceSettingTab />,
		},
		{
			label: 'تصویر زمینه',
			value: 'wallpapers',
			icon: <VscPaintcan size={20} />,
			element: <WallpaperSetting />,
		},
		{
			label: 'آب هوا',
			value: 'weather',
			icon: <VscCloud size={20} />,
			element: <WeatherOptions />,
		},
		{
			label: 'حساب کاربری',
			value: 'account',
			icon: <VscAccount size={20} />,
			element: <AccountTab />,
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

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl" title="تنظیمات" direction="rtl">
			<TabManager
				tabs={tabs}
				defaultTab="general"
				selectedTab={selectedTab}
				direction="rtl"
			/>
		</Modal>
	)
}
