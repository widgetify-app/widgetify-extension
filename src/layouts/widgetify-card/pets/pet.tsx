import { usePetContext } from './pet.context'
import { PetFactory } from './pet-factory'
import { useGeneralSetting } from '@/context/general-setting.context'

export function Pet() {
	const { isOptimalMode } = useGeneralSetting()
	const { isEnabled } = usePetContext()

	if (!isEnabled || isOptimalMode) return null

	return <PetFactory />
}
