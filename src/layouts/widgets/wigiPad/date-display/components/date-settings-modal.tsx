import { useState } from 'react'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { ItemSelector } from '@/components/item-selector'
import Modal from '@/components/modal'
import { type WigiPadDateOptions, WigiPadDateType } from '../types'

interface DateSettingsModalProps {
	isOpen: boolean
	dateSetting: WigiPadDateOptions
	onClose: (newSetting: WigiPadDateOptions) => void
}

export function WigiPadDateSettingsModal({
	isOpen,
	onClose,
	dateSetting,
}: DateSettingsModalProps) {
	const [selectedType, setSelectedType] = useState<WigiPadDateType>(
		dateSetting.dateType
	)

	const handleSave = () => {
		Analytics.event(`wigipad_date_settings_${selectedType}_save`)
		onClose({
			dateType: selectedType,
		})
	}

	const handleCancel = () => {
		onClose(dateSetting)
	}

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

	useEffect(() => {
		if (isOpen) {
			Analytics.event('wigipad_date_settings_open', {
				dateType: selectedType,
			})
		}
		return () => {
			setSelectedType(dateSetting.dateType)
		}
	}, [isOpen])

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleCancel}
			title="تنظیمات تاریخ"
			size="md"
			direction="rtl"
		>
			<div className="space-y-6">
				<div>
					<p className="mb-3 text-sm text-muted">
						نوع نمایش تاریخ را انتخاب کنید:
					</p>

					<div className="flex gap-2">
						{DateOptions.map((option) => (
							<ItemSelector
								key={option.key}
								isActive={selectedType === option.value}
								onClick={() => setSelectedType(option.value)}
								label={option.label}
								description={option.description}
								className="flex-1 text-center"
							/>
						))}
					</div>
				</div>

				<div className="flex gap-3 mt-2">
					<Button
						onClick={handleCancel}
						className="flex-1 px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-content text-content"
						size="md"
					>
						انصراف
					</Button>
					<Button
						isPrimary={true}
						size="md"
						onClick={handleSave}
						className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg"
					>
						ذخیره
					</Button>
				</div>
			</div>
		</Modal>
	)
}
