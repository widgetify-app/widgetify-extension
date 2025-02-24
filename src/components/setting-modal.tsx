import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { VscCloud, VscPaintcan, VscSettingsGear } from 'react-icons/vsc'
import { WallpaperSetting } from '../layouts/setting/tabs/wallpapers'
import { WeatherOptions } from '../layouts/setting/tabs/weather'
import Modal from './modal'

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
			element: (
				<div className="p-4">
					<h2 className="text-lg font-semibold mb-4 font-[Vazir]">تنظیمات عمومی</h2>
				</div>
			),
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
	]

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl" title="تنظیمات" direction="rtl">
			<div dir="rtl" className="flex flex-col h-[600px]">
				{/* Tab Content */}
				<div className="relative flex-1 mb-4 overflow-hidden rounded-lg">
					<AnimatePresence mode="wait">
						{tabs.map(
							({ value, element }) =>
								activeTab === value && (
									<motion.div
										key={value}
										className="absolute inset-0 overflow-auto rounded-lg bg-[#1c1c1c]/60 p-4"
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 20 }}
										transition={{ duration: 0.2 }}
									>
										{element}
									</motion.div>
								),
						)}
					</AnimatePresence>
				</div>

				{/* Bottom Tab Buttons */}
				<div className="flex items-center gap-2 p-2 bg-[#1c1c1c]/60 rounded-lg mt-auto">
					{tabs.map(({ label, value, icon }) => (
						<motion.button
							key={value}
							onClick={() => setActiveTab(value)}
							className={`relative flex items-center gap-3 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
								activeTab === value
									? 'text-white'
									: 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
							}`}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<span className="text-gray-400">{icon}</span>
							<span className="font-[Vazir] text-sm">{label}</span>
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
			</div>
		</Modal>
	)
}
