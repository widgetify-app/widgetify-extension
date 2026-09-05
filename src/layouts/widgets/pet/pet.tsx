import { PetFactory } from './pet-factory'
import { useGeneralSetting } from '@/context/general-setting.context'

export function Pet() {
	const { isOptimalMode } = useGeneralSetting()

	if (isOptimalMode) return null

	return <PetFactory />
}
