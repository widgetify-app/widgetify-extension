import { motion } from 'framer-motion'
import { memo } from 'react'
import { useTheme } from '@/context/theme.context'

interface CustomCheckboxProps {
	checked: boolean
	onChange: (checked: boolean) => void
	label?: string
	theme?: string
}

const CustomCheckbox = ({
	checked,
	onChange,
	label,
	theme: propTheme,
}: CustomCheckboxProps) => {
	const { theme: contextTheme } = useTheme()

	const theme = propTheme || contextTheme || 'glass'

	const getCheckboxStyle = () => {
		if (checked) {
			return 'bg-blue-500 border-blue-500'
		}

		switch (theme) {
			case 'light':
				return 'bg-white border-gray-300 hover:border-gray-400'
			case 'dark':
				return 'bg-gray-700 border-gray-600 hover:border-gray-500'
			default: // glass
				return 'bg-white/5 border-white/20 hover:border-white/30'
		}
	}

	const getLabelStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			case 'dark':
				return 'text-gray-200'
			default: // glass
				return 'text-gray-300'
		}
	}

	return (
		<motion.label
			className="relative flex items-center cursor-pointer group"
			whileTap={{ scale: 0.95 }}
		>
			<div className="relative">
				<input
					type="checkbox"
					className="sr-only peer"
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
				/>
				<motion.div
					className={`w-5 h-5 border rounded-md flex items-center justify-center transition-colors duration-200 ${getCheckboxStyle()}`}
					initial={false}
				>
					<motion.svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						initial={{ scale: 0 }}
						animate={{ scale: checked ? 1 : 0 }}
						transition={{ duration: 0.15 }}
					>
						<motion.path
							d="M2.5 6L5 8.5L9.5 4"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: checked ? 1 : 0 }}
							transition={{ duration: 0.2 }}
						/>
					</motion.svg>
				</motion.div>
			</div>
			{label && <span className={`ml-2 text-sm ${getLabelStyle()}`}>{label}</span>}
		</motion.label>
	)
}

export default memo(CustomCheckbox)
