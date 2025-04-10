import CustomCheckbox from '@/components/checkbox'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'

interface Props {
	isEnabled: boolean
	onToggle: () => void
	title: string
	description?: string
}

export function CheckBoxWithDescription({
	isEnabled,
	onToggle,
	title,
	description,
}: Props) {
	const { theme, themeUtils } = useTheme()

	const getContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70 hover:bg-gray-200/70'
			case 'dark':
				return 'bg-gray-800/70 hover:bg-gray-700/70'
			default: // glass
				return 'bg-white/5 hover:bg-white/8'
		}
	}

	return (
		<motion.div
			className={`flex items-start gap-3 p-4 transition-colors cursor-pointer rounded-xl backdrop-blur-sm ${getContainerStyle()}`}
			onClick={onToggle}
			whileHover={{ scale: 1.01 }}
			whileTap={{ scale: 0.99 }}
		>
			<CustomCheckbox checked={isEnabled} onChange={onToggle} theme={theme} />
			<div className="flex-1">
				<p className={`font-medium ${themeUtils.getHeadingTextStyle()}`}>{title}</p>
				{description ? (
					<p className={`text-sm font-light ${themeUtils.getDescriptionTextStyle()}`}>
						{description}
					</p>
				) : null}
			</div>
		</motion.div>
	)
}
