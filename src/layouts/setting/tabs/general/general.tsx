import { motion } from 'framer-motion'
import { useGeneralSetting } from '../../../../context/general-setting.context'
import { ContentAlignmentSettings } from './components/content-alignment-settings'
import { FontSelector } from './components/font-selector'
import { PetSettings } from './components/pet-settings'
import { PrivacySettings } from './components/privacy-settings'
import { ThemeSelector } from './components/theme-selector'

export function GeneralSettingTab() {
	const {
		analyticsEnabled,
		setAnalyticsEnabled,
		enablePets,
		setEnablePets,
		petName,
		setPetName,
		contentAlignment,
		setContentAlignment,
		fontFamily,
		setFontFamily,
	} = useGeneralSetting()

	const visualSettings = [
		<ThemeSelector key="theme" />,
		<ContentAlignmentSettings
			key="alignment"
			contentAlignment={contentAlignment}
			setContentAlignment={setContentAlignment}
		/>,
		<FontSelector key="font" fontFamily={fontFamily} setFontFamily={setFontFamily} />,
	]

	const functionalSettings = [
		<PrivacySettings
			key="privacy"
			analyticsEnabled={analyticsEnabled}
			setAnalyticsEnabled={setAnalyticsEnabled}
		/>,
	]

	const additionalFeatures = [
		<PetSettings
			key="pets"
			enablePets={enablePets}
			setEnablePets={setEnablePets}
			petName={petName}
			setPetName={setPetName}
		/>,
	]

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="space-y-8">
				<div className="space-y-6">
					<motion.h2
						className="text-lg font-medium text-blue-500"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
					>
						تنظیمات ظاهری
					</motion.h2>
					{visualSettings}
				</div>

				<div className="space-y-6">
					<motion.h2
						className="text-lg font-medium text-blue-500"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						تنظیمات عملکردی
					</motion.h2>
					{functionalSettings}
				</div>

				<div className="space-y-6">
					<motion.h2
						className="text-lg font-medium text-blue-500"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
					>
						ویژگی‌های اضافی
					</motion.h2>
					{additionalFeatures}
				</div>
			</div>
		</motion.div>
	)
}
