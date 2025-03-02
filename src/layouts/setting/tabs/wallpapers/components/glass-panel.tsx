import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlassPanelProps {
	title: string
	children: ReactNode
	delay?: number
}

export function GlassPanel({ title, children, delay = 0 }: GlassPanelProps) {
	return (
		<motion.div
			className="overflow-hidden border shadow-lg rounded-xl backdrop-filter backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-white/10"
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
