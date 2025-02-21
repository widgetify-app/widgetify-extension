import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import React, { useState } from 'react'
import { VscCloud, VscPaintcan, VscSettingsGear } from 'react-icons/vsc'
import { WeatherOptions } from '../layouts/weather/components/options-modal.component'
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
			element: (
				<div className="p-4">
					<h2 className="text-lg font-semibold mb-4 font-[Vazir]">تنظیمات تصویر زمینه</h2>
				</div>
			),
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
			<div className="pb-5" dir="rtl">
				<Tabs value={activeTab} orientation="horizontal">
					<TabsBody className="flex-1">
						{tabs.map(({ value, element }) => (
							<TabPanel key={value} value={value} className="overflow-auto h-96">
								{element}
							</TabPanel>
						))}
					</TabsBody>

					<TabsHeader
						className="w-full bg-[#242424]"
						indicatorProps={{
							className: 'bg-blue-50  bg-[#1d1d1d]',
						}}
					>
						{tabs.map(({ label, value, icon }) => (
							<Tab
								key={value}
								value={value}
								onClick={() => setActiveTab(value)}
								className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-[#1d1d1d] rounded transition-all duration-200"
							>
								<div className="flex items-center justify-start w-full gap-3">
									<p className="text-gray-400">{icon}</p>
									<span className="font-[Vazir] text-sm dark:text-[#e8e7e7] text-gray-400">
										{label}
									</span>
								</div>
							</Tab>
						))}
					</TabsHeader>
				</Tabs>
			</div>
		</Modal>
	)
}
