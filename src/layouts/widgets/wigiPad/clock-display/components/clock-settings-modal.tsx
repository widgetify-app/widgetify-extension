import { Button } from '@/components/button/button'
import { ItemSelector } from '@/components/item-selector'
import Modal from '@/components/modal'
import { useState } from 'react'
import { ClockType } from '../clock-display'

interface ClockSettingsModalProps {
	isOpen: boolean
	clockType: ClockType
	onClose: (clockType: ClockType) => void
}

export function ClockSettingsModal({
	isOpen,
	onClose,
	clockType,
}: ClockSettingsModalProps) {
	const [selectedType, setSelectedType] = useState<ClockType>(clockType)

	const handleSave = () => {
		onClose(selectedType)
	}

	const handleCancel = () => {
		onClose(selectedType)
	}

	const clockOptions = [
		{
			key: 'digital',
			label: 'ساعت دیجیتال',
			description: 'نمایش ساعت به صورت عددی',
			value: ClockType.Digital as const,
		},
		{
			key: 'analog',
			label: 'ساعت آنالوگ',
			description: 'نمایش ساعت به صورت عقربه‌ای',
			value: ClockType.Analog as const,
		},
	]

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleCancel}
			title="تنظیمات ساعت"
			size="md"
			direction="rtl"
		>
			<div className="space-y-4">
				<p className="text-sm text-muted">نوع نمایش ساعت را انتخاب کنید:</p>

				<div className="space-y-3">
					{clockOptions.map((option) => (
						<ItemSelector
							key={option.key}
							isActive={selectedType === option.value}
							onClick={() => setSelectedType(option.value)}
							label={option.label}
							description={option.description}
							className="w-full"
						/>
					))}
				</div>

				<div className="flex gap-3 pt-4 border-t border-content">
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
