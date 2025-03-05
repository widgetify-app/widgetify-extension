import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { VscCloud, VscInfo, VscPaintcan, VscSettingsGear } from 'react-icons/vsc'
import Modal from '../../components/modal'
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

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl" title="تنظیمات" direction="rtl">
			<div dir="rtl" className="flex flex-row h-[600px] gap-4">
				{/* Right Side Tab Buttons */}
				<div className="flex flex-col gap-2 p-2 bg-[#1c1c1c]/60 rounded-lg w-48 shrink-0">
					{tabs.map(({ label, value, icon }) => (
						<motion.button
							key={value}
							onClick={() => setActiveTab(value)}
							className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors justify-start ${
								activeTab === value
									? 'text-white'
									: 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
							}`}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<span className="text-gray-400">{icon}</span>
							<span className="text-sm">{label}</span>
							{activeTab === value && (
								<motion.div
									className="absolute inset-0 rounded-lg bg-white/10 -z-10"
									layoutId="activeTab"
									transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
								/>
							)}
						</motion.button>
					))}
				</div>

				{/* Tab Content - Takes remaining space */}
				<div className="relative flex-1 overflow-hidden rounded-lg">
					<AnimatePresence mode="wait">
						{tabs.map(
							({ value, element }) =>
								activeTab === value && (
									<motion.div
										key={value}
										className="absolute inset-0 overflow-auto rounded-lg bg-[#1c1c1c]/60 p-4"
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
