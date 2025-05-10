import { getBorderColor, useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { BsCurrencyExchange } from 'react-icons/bs'
import { FaGear } from 'react-icons/fa6'

interface ArzHeaderProps {
	title: string
	onSettingsClick: () => void
}

export const ArzHeader = ({ title, onSettingsClick }: ArzHeaderProps) => {
	const { theme } = useTheme()

	return (
		<div
			className={`top-0 z-20 flex items-center justify-between w-full pb-2 mb-2 border-b ${getBorderColor(theme)}`}
		>
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<BsCurrencyExchange className="w-4 h-4 opacity-70" />
					<p className="text-lg font-bold">{title}</p>
				</div>

				<div className="flex items-center mt-1 mr-2 text-xs">
					<span className="font-light opacity-70">نرخ‌ها رو چک کن و به‌روز بمون</span>
				</div>
			</div>

			<motion.button
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				className="p-1 rounded-full cursor-pointer hover:bg-gray-500/10"
				onClick={onSettingsClick}
			>
				<FaGear className="w-3 h-3 opacity-70 hover:opacity-100" />
			</motion.button>
		</div>
	)
}
