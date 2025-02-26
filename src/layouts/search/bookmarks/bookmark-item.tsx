import { motion } from 'framer-motion'
import { useState } from 'react'

type OptionButtonProps = {
	onClick: () => void
	title: string
	icon: React.ReactNode
}
export function BookmarkItem({ icon, onClick, title }: OptionButtonProps) {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<motion.button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.02 }}
			className="relative flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer group bg-neutral-900/70 backdrop-blur-sm hover:bg-neutral-800/80 rounded-xl border-white/10 hover:border-white/20 min-w-[5.4rem] max-w-[5.4rem]"
		>
			<div className="relative flex items-center justify-center w-8 h-8 mb-2">{icon}</div>
			<span className="text-[10px] w-full text-center font-medium text-gray-400 transition-colors duration-300 group-hover:text-white truncate">
				{title}
			</span>

			{isHovered && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 0.9, y: 0 }}
					className="absolute z-50 px-2 py-1 text-sm text-white transition-all duration-200 -translate-y-full rounded-lg bg-neutral-900/70 -top-2"
				>
					{title}
				</motion.div>
			)}

			<div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-white/5 to-transparent" />
		</motion.button>
	)
}
