import CustomCheckbox from '../../../../../components/checkbox'

interface RetouchFilterProps {
	isEnabled: boolean
	onToggle: () => void
}

export function RetouchFilter({ isEnabled, onToggle }: RetouchFilterProps) {
	return (
		<div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
			<CustomCheckbox checked={isEnabled} onChange={onToggle} />
			<div onClick={onToggle} className="cursor-pointer">
				<p className="font-medium text-gray-200">فیلتر تصویر</p>
				<p className="text-sm font-light text-gray-400">
					با فعال کردن این گزینه تصویر زمینه شما تاریک تر خواهد شد
				</p>
			</div>
		</div>
	)
}
