import { useGeneralSetting } from '@/context/general-setting.context'
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
		<div className="w-full max-w-xl mx-auto">
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
		</div>
	)
}
