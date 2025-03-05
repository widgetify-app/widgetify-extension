import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionPanelProps {
	title: string
	children: ReactNode
	delay?: number
}

export function SectionPanel({ title, children, delay = 0 }: SectionPanelProps) {
	return (
		<motion.div
			className="overflow-hidden rounded-xl"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
		>
			<div className="p-4 border-b border-white/10">
				<div className="flex items-center gap-2">
					<h3 className="text-lg font-medium text-gray-200">{title}</h3>
				</div>
			</div>
			<div className="p-4">{children}</div>
		</motion.div>
	)
}
