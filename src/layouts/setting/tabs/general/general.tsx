import { motion } from 'motion/react'
import { useGeneralSetting } from '../../../../context/general-setting.context'
import { ContentAlignmentSettings } from './components/content-alignment-settings'
import { FontSelector } from './components/font-selector'
import { PetSettings } from './components/pet-settings'
import { PrivacySettings } from './components/privacy-settings'

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

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="space-y-6">
				<PrivacySettings
					analyticsEnabled={analyticsEnabled}
					setAnalyticsEnabled={setAnalyticsEnabled}
				/>

				<FontSelector fontFamily={fontFamily} setFontFamily={setFontFamily} />

				<PetSettings
					enablePets={enablePets}
					setEnablePets={setEnablePets}
					petName={petName}
					setPetName={setPetName}
				/>

				<ContentAlignmentSettings
					contentAlignment={contentAlignment}
					setContentAlignment={setContentAlignment}
				/>
			</div>
		</motion.div>
	)
}
