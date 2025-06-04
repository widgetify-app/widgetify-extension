import { ItemSelector } from '@/components/item-selector'
import Modal from '@/components/modal'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useState } from 'react'

interface ClockSettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

export function ClockSettingsModal({ isOpen, onClose }: ClockSettingsModalProps) {
	const { clockType, setClockType } = useGeneralSetting()
	const [selectedType, setSelectedType] = useState<'analog' | 'digital'>(clockType)

	const handleSave = () => {
		setClockType(selectedType)
		onClose()
	}

	const handleCancel = () => {
		setSelectedType(clockType) // Reset to original value
		onClose()
	}

	const clockOptions = [
		{
			key: 'digital',
			label: 'ساعت دیجیتال',
			description: 'نمایش ساعت به صورت عددی',
			value: 'digital' as const,
		},
		{
			key: 'analog',
			label: 'ساعت آنالوگ',
			description: 'نمایش ساعت به صورت عقربه‌ای',
			value: 'analog' as const,
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
					<button
						onClick={handleCancel}
						className="flex-1 px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-content text-content hover:bg-content/10"
					>
						انصراف
					</button>
					<button
						onClick={handleSave}
						className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
					>
						ذخیره
					</button>
				</div>
			</div>
		</Modal>
	)
}
