import { useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { ItemSelector } from '@/components/item-selector'
import { WigiPadDateType } from './date-setting.interface'

const DateOptions = [
	{
		key: 'jalali',
		label: 'تقویم جلالی',
		description: 'نمایش تاریخ به صورت جلالی',
		value: WigiPadDateType.Jalali as const,
	},
	{
		key: 'gregorian',
		label: 'تقویم میلادی',
		description: 'نمایش تاریخ به صورت میلادی',
		value: WigiPadDateType.Gregorian as const,
	},
]

export function WigiPadDateSettingsModal() {
	const [selectedType, setSelectedType] = useState<WigiPadDateType | null>()

	useEffect(() => {
		async function load() {
			const wigiPadDateFromStore = await getFromStorage('wigiPadDate')
			if (wigiPadDateFromStore) {
				setSelectedType(wigiPadDateFromStore.dateType)
			} else {
				setSelectedType(WigiPadDateType.Jalali)
			}
		}

		load()
	}, [])

	const onSelectType = async (type: WigiPadDateType) => {
		await setToStorage('wigiPadDate', { dateType: type })
		setSelectedType(type)
		callEvent('wigiPadDateSettingsChanged', { dateType: type })
		Analytics.event(`wigipad_date_settings_${selectedType}_save`)
	}

	return (
		<div className="space-y-3">
			<div>
				<p className="mb-3 text-sm text-muted">نوع نمایش تاریخ را انتخاب کنید:</p>

				<div className="flex gap-2">
					{DateOptions.map((option) => (
						<ItemSelector
							key={option.key}
							isActive={selectedType === option.value}
							onClick={() => onSelectType(option.value)}
							label={option.label}
							description={option.description}
							className="flex-1 text-center"
						/>
					))}
				</div>
			</div>
		</div>
	)
}
