import { getFromStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import CustomCheckbox from '@/components/checkbox'
import { ItemSelector } from '@/components/item-selector'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import {
  getBorderColor,
  getDescriptionTextStyle,
  getHeadingTextStyle,
  useTheme,
} from '@/context/theme.context'
import {
  BASE_PET_OPTIONS,
  PetTypes,
} from '@/layouts/widgetify-card/pets/pet.context'
import { useEffect, useState } from 'react'

export function PetSettings() {
  const { theme } = useTheme()
  const [enablePets, setEnablePets] = useState(true)
  const [petType, setPetType] = useState<PetTypes>(PetTypes.DOG_AKITA)
  const [petName, setPetName] = useState<string>('')

  useEffect(() => {
    async function load() {
      const storedPets = await getFromStorage('pets')
      if (storedPets) {
        const type = storedPets.petType || PetTypes.DOG_AKITA
        setEnablePets(storedPets.enablePets)
        setPetType(type)
        setPetName(storedPets.petOptions[type].name)
      }
    }

    load()
  }, [])

  async function onChangeEnablePets(value: boolean) {
    callEvent('updatedPetSettings', {
      enablePets: value,
      petType,
    })
    setEnablePets(value)
  }

  async function onChangePetName(value: string) {
    callEvent('updatedPetSettings', {
      petName: value,
      petType,
    })
    setPetName(value)
  }

  async function onChangePetType(value: PetTypes) {
    const storedPets = await getFromStorage('pets')
    if (storedPets?.petOptions[value]) {
      setPetName(storedPets.petOptions[value].name)
    }
    setPetType(value)

    callEvent('updatedPetSettings', {
      petType: value,
    })
  }
  const persianType: Record<string, string> = {
    dog: 'سگ',
    chicken: 'مرغ',
    crab: 'خرچنگ',
  }
  const availablePets = Object.entries(BASE_PET_OPTIONS.petOptions).map(
    ([key, value]) => ({
      value: key as PetTypes,
      label: `${value.emoji} ${persianType[value.type] || ''} - ${value.name}`,
    }),
  )

  return (
    <SectionPanel title="قابلیت‌های ظاهری" delay={0.2}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <CustomCheckbox
            checked={enablePets}
            onChange={() => onChangeEnablePets(!enablePets)}
          />
          <div
            onClick={() => onChangeEnablePets(!enablePets)}
            className="cursor-pointer"
          >
            <p className={`font-medium ${getHeadingTextStyle(theme)}`}>
              نمایش حیوان خانگی
            </p>
            <p
              className={`text-sm font-light ${getDescriptionTextStyle(theme)}`}
            >
              نمایش حیوان خانگی تعاملی روی صفحه اصلی
            </p>
          </div>
        </div>

        {enablePets && (
          <div
            className={`p-4 mt-4 rounded-lg border ${getBorderColor(theme)}`}
          >
            <p className={`mb-3 font-medium ${getHeadingTextStyle(theme)}`}>
              نوع حیوان خانگی
            </p>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {availablePets.map((pet) => (
                <ItemSelector
                  isActive={petType === pet.value}
                  onClick={() => onChangePetType(pet.value)}
                  key={pet.value}
                  label={pet.label}
                  defaultActive={PetTypes.DOG_AKITA}
                  className="!w-full !h-12 !p-2.5 !text-sm text-center"
                />
              ))}
            </div>

            <p className={`mb-3 font-medium ${getHeadingTextStyle(theme)}`}>
              نام حیوان خانگی
            </p>
            <TextInput
              type="text"
              value={petName}
              onChange={(value) => onChangePetName(value)}
              placeholder={'اسم دلخواه...'}
            />
          </div>
        )}
      </div>
    </SectionPanel>
  )
}
