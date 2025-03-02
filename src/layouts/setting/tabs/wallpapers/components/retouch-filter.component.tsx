import { motion } from 'motion/react'
import CustomCheckbox from '../../../../../components/checkbox'

interface RetouchFilterProps {
	isEnabled: boolean
	onToggle: () => void
}

export function RetouchFilter({ isEnabled, onToggle }: RetouchFilterProps) {
	return (
		<motion.div
			className="flex items-start gap-3 p-4 transition-colors cursor-pointer rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/8"
			onClick={onToggle}
			whileHover={{ scale: 1.01 }}
			whileTap={{ scale: 0.99 }}
		>
			<CustomCheckbox checked={isEnabled} onChange={onToggle} />
			<div className="flex-1">
				<p className="font-medium text-gray-200">فیلتر تصویر</p>
				<p className="text-sm font-light text-gray-400">
					با فعال کردن این گزینه تصویر زمینه شما تاریک‌تر خواهد شد
				</p>
			</div>
		</motion.div>
	)
}
