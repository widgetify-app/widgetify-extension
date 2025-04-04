import Modal from '@/components/modal'

interface CycleSettingsModalProps {
	isOpen: boolean
	onClose: () => void
	cycleDaysInput: string
	onChange: (value: string) => void
	onSave: () => void
}

export const CycleSettingsModal = ({
	isOpen,
	onClose,
	cycleDaysInput,
	onChange,
	onSave,
}: CycleSettingsModalProps) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="تنظیمات چرخه قاعدگی"
			size="sm"
			direction="rtl"
		>
			<div className="p-4">
				<div className="mb-4">
					<label className="block mb-2 text-sm font-medium">طول چرخه (روز)</label>
					<input
						type="number"
						className="w-full px-3 py-2 text-sm bg-transparent border border-gray-300 rounded dark:border-gray-700"
						value={cycleDaysInput}
						onChange={(e) => onChange(e.target.value)}
						min="21"
						max="45"
					/>
					<p className="mt-1 text-xs opacity-70">
						طول چرخه معمولاً بین ۲۱ تا ۴۵ روز است. متوسط ۲۸ روز است.
					</p>
				</div>

				<div className="p-3 mb-4 text-sm text-pink-500 rounded-lg bg-pink-500/10">
					<p>با ذخیره تنظیمات، چرخه جدیدی از امروز آغاز خواهد شد.</p>
				</div>

				<div className="flex justify-end gap-2">
					<button
						className="px-4 py-2 text-sm bg-gray-200 rounded dark:bg-gray-800"
						onClick={onClose}
					>
						انصراف
					</button>
					<button
						className="px-4 py-2 text-sm text-white bg-pink-500 rounded"
						onClick={onSave}
					>
						ذخیره تنظیمات
					</button>
				</div>
			</div>
		</Modal>
	)
}
