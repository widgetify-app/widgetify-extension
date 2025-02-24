import { motion } from 'motion/react'

interface CustomCheckboxProps {
	checked: boolean
	onChange: (checked: boolean) => void
	label?: string
}

export const CustomCheckbox = ({ checked, onChange, label }: CustomCheckboxProps) => {
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
					className={`w-5 h-5 border rounded-md flex items-center justify-center
            ${
							checked
								? 'bg-blue-500 border-blue-500'
								: 'bg-white/5 border-white/20 hover:border-white/30'
						}
            transition-colors duration-200`}
					initial={false}
				>
					<motion.svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						initial={{ scale: 0 }}
						animate={{ scale: checked ? 1 : 0 }}
						transition={{ duration: 0 }}
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
			{label && <span className="ml-2 text-sm text-gray-300">{label}</span>}
		</motion.label>
	)
}
