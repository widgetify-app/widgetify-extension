import { useGeneralSetting } from '@/context/general-setting.context'
import { motion } from 'framer-motion'
import { PetSettings } from './components/pet-settings'
import { PrivacySettings } from './components/privacy-settings'
import { SelectCity } from './components/select-city'

export function GeneralSettingTab() {
	const {
		analyticsEnabled,
		setAnalyticsEnabled,
		enablePets,
		setEnablePets,
		petName,
		setPetName,
	} = useGeneralSetting()

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<SelectCity key={'selectCity'} />
			<PrivacySettings
				key="privacy"
				analyticsEnabled={analyticsEnabled}
				setAnalyticsEnabled={setAnalyticsEnabled}
			/>
			<PetSettings
				key="pets"
				enablePets={enablePets}
				setEnablePets={setEnablePets}
				petName={petName}
				setPetName={setPetName}
			/>
		</motion.div>
	)
}
