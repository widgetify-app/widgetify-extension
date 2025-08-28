import { useState } from 'react'
import Analytics from '@/analytics'
import { RequireAuth } from '@/components/auth/require-auth'
import { Button } from '@/components/button/button'
import { CheckBoxWithDescription } from '@/components/checkbox-description.component'
import { ItemSelector } from '@/components/item-selector'
import Modal from '@/components/modal'
import { type ClockSettings, ClockType } from '../clock-display'

interface ClockSettingsModalProps {
	isOpen: boolean
	clockSetting: ClockSettings
	onClose: (newSetting: ClockSettings) => void
}

export function ClockSettingsModal({
	isOpen,
	onClose,
	clockSetting,
}: ClockSettingsModalProps) {
	const [selectedType, setSelectedType] = useState<ClockType>(clockSetting.clockType)
	const [showSeconds, setShowSeconds] = useState<boolean>(clockSetting.showSeconds)
	const [showTimeZone, setShowTimeZone] = useState<boolean>(clockSetting.showTimeZone)

	const handleSave = () => {
		onClose({
			clockType: selectedType,
			showSeconds,
			showTimeZone,
		})

		Analytics.event('wigipad_clock_settings_save', {
			clockType: selectedType,
			showSeconds,
			showTimeZone,
		})
	}

	const handleCancel = () => {
		onClose(clockSetting)
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

	useEffect(() => {
		if (isOpen) {
			Analytics.event('wigipad_clock_settings_open')
		}

		return () => {
			setSelectedType(clockSetting.clockType)
			setShowSeconds(clockSetting.showSeconds)
			setShowTimeZone(clockSetting.showTimeZone)
		}
	}, [isOpen])

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleCancel}
			title="تنظیمات ساعت"
			size="md"
			direction="rtl"
		>
			<div className="space-y-6">
				<div>
					<p className="mb-3 text-sm text-muted">
						نوع نمایش ساعت را انتخاب کنید:
					</p>

					<div className="flex gap-2">
						{clockOptions.map((option) => (
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

				<RequireAuth mode="preview">
					<div className="px-1 space-y-2">
						<CheckBoxWithDescription
							isEnabled={showSeconds}
							onToggle={() => setShowSeconds(!showSeconds)}
							title="نمایش ثانیه"
							description="نمایش ثانیه در ساعت دیجیتال"
						/>

						<CheckBoxWithDescription
							isEnabled={showTimeZone}
							onToggle={() => setShowTimeZone(!showTimeZone)}
							title="نمایش منطقه زمانی"
							description="نمایش نام منطقه زمانی زیر ساعت"
						/>
					</div>
				</RequireAuth>

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
