import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useTheme } from '@/context/theme.context'

interface SectionPanelProps {
	title: string
	children: ReactNode
	delay?: number
}

export function SectionPanel({ title, children, delay = 0 }: SectionPanelProps) {
	const { theme, themeUtils } = useTheme()

	const getBorderStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-300/30'
			case 'dark':
				return 'border-gray-700/40'
			default: // glass
				return 'border-white/10'
		}
	}

	return (
		<motion.div
			className="overflow-hidden rounded-xl"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
		>
			<div className={`p-4 border-b ${getBorderStyle()}`}>
				<div className="flex items-center gap-2">
					<h3 className={`text-lg font-medium ${themeUtils.getHeadingTextStyle()}`}>
						{title}
					</h3>
				</div>
			</div>
			<div className="p-4">{children}</div>
		</motion.div>
	)
}
