import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { VscCloud, VscInfo, VscPaintcan, VscSettingsGear } from 'react-icons/vsc'
import Modal from '../../components/modal'
import { useTheme } from '../../context/theme.context'
import { AboutUsTab } from './tabs/about-us/about-us'
import { GeneralSettingTab } from './tabs/general/general'
import { WallpaperSetting } from './tabs/wallpapers/wallpapers'
import { WeatherOptions } from './tabs/weather/weather'

interface SettingModalProps {
	isOpen: boolean
	onClose: () => void
}

export const SettingModal = ({ isOpen, onClose }: SettingModalProps) => {
	const [activeTab, setActiveTab] = useState('general')
	const { theme } = useTheme()

	const tabs = [
		{
			label: 'عمومی',
			value: 'general',
			icon: <VscSettingsGear size={20} />,
			element: <GeneralSettingTab />,
		},
		{
			label: 'تصویر زمینه',
			value: 'backgrounds',
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
			label: 'درباره ما',
			value: 'about',
			icon: <VscInfo size={20} />,
			element: <AboutUsTab />,
		},
	]

	const getTabButtonStyle = (isActive: boolean) => {
		return clsx({
			'text-blue-600 bg-blue-50': isActive && theme === 'light', // light mode
			'text-white bg-neutral-700/20': isActive && theme !== 'light', // dark/glass mode
			'text-gray-600 hover:text-gray-800 hover:bg-gray-100/80':
				!isActive && theme === 'light', // not active light mode
			'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50':
				!isActive && theme === 'dark', // not active dark mode
			'text-gray-400 hover:text-gray-200 hover:bg-white/5':
				!isActive && theme !== 'light' && theme !== 'dark', // not active glass mode
		})
	}

	const getTabIconStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500'
			case 'dark':
				return 'text-gray-500'
			default:
				return 'text-gray-400'
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl" title="تنظیمات" direction="rtl">
			<div dir="rtl" className="flex flex-row h-[600px] gap-4">
				<div className={'flex flex-col w-48 gap-2 p-2 rounded-lg shrink-0 '}>
					{tabs.map(({ label, value, icon }) => (
						<motion.button
							key={value}
							onClick={() => setActiveTab(value)}
							className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors justify-start cursor-pointer ${getTabButtonStyle(activeTab === value)}`}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<span className={getTabIconStyle()}>{icon}</span>
							<span className="text-sm">{label}</span>
						</motion.button>
					))}
				</div>

				<div className={'relative flex-1 overflow-hidden rounded-lg '}>
					<AnimatePresence mode="wait">
						{tabs.map(
							({ value, element }) =>
								activeTab === value && (
									<motion.div
										key={value}
										className="absolute inset-0 p-4 overflow-auto rounded-lg"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.2 }}
									>
										{element}
									</motion.div>
								),
						)}
					</AnimatePresence>
				</div>
			</div>
		</Modal>
	)
}
