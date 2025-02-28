import { motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'

import { StoreKey } from '../../../../common/constant/store.key'
import { getFromStorage, setToStorage } from '../../../../common/storage'
import CustomCheckbox from '../../../../components/checkbox'

interface GeneralData {
	analyticsEnabled: boolean
}
export function GeneralSettingTab() {
	const [generalSetting, setGeneralSetting] = useState<GeneralData>({
		analyticsEnabled: false,
	})

	useEffect(() => {
		async function getUserProfile() {
			const data = await getFromStorage<GeneralData>(StoreKey.General_setting)
			if (data) {
				setGeneralSetting(data)
			}
		}

		getUserProfile()
	}, [])

	const handleAnalyticsChange = useCallback(() => {
		const item = {
			...generalSetting,
			analyticsEnabled: !generalSetting.analyticsEnabled,
		}
		setGeneralSetting(item)
		setToStorage(StoreKey.General_setting, item)
	}, [generalSetting])

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<h1 className="mb-6 text-2xl font-semibold text-gray-200 font-[Vazir]">
				تنظیمات عمومی
			</h1>

			{/* Google Analytics Toggle */}
			<div className="mb-6">
				<h2 className="mb-4 text-xl font-semibold text-gray-200 font-[Vazir]">
					حریم خصوصی
				</h2>
				<div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
					<CustomCheckbox
						checked={generalSetting.analyticsEnabled}
						onChange={handleAnalyticsChange}
					/>
					<div onClick={() => handleAnalyticsChange()} className="cursor-pointer">
						<p className="font-medium font-[Vazir] text-gray-200">گوگل آنالیتیکس</p>
						<p className="text-sm font-[Vazir] text-gray-400">
							با فعال کردن این گزینه، آمار استفاده از برنامه برای بهبود عملکرد جمع‌آوری
							می‌شود. هیچ اطلاعات شخصی ارسال نخواهد شد
						</p>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
