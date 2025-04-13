import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import React from 'react'

interface SectionPanelProps {
	title: string
	children: ReactNode
	delay?: number
	size?: 'xs' | 'sm' | 'md' | 'lg'
	icon?: React.ReactElement
}

export function SectionPanel({
	title,
	children,
	delay = 0,
	size = 'md',
	icon,
}: SectionPanelProps) {
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

	const getSizeStyles = () => {
		switch (size) {
			case 'xs':
				return {
					container: 'rounded-sm',
					header: 'p-1',
					title: 'text-sm',
					content: 'p-1',
				}
			case 'sm':
				return {
					container: 'rounded-lg',
					header: 'p-3',
					title: 'text-base',
					content: 'p-3',
				}
			case 'lg':
				return {
					container: 'rounded-xl',
					header: 'p-5',
					title: 'text-xl',
					content: 'p-5',
				}
			default: // md
				return {
					container: 'rounded-xl',
					header: 'p-4',
					title: 'text-lg',
					content: 'p-4',
				}
		}
	}

	const sizeStyles = getSizeStyles()

	return (
		<motion.div
			className={`overflow-hidden ${sizeStyles.container}`}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
		>
			<div className={`${sizeStyles.header} border-b ${getBorderStyle()}`}>
				<div className="flex items-center justify-between gap-2">
					<h3
						className={`font-medium ${sizeStyles.title} ${themeUtils.getHeadingTextStyle()}`}
					>
						{title}
					</h3>
					{icon && React.cloneElement(icon, {})}
				</div>
			</div>
			<div className={sizeStyles.content}>{children}</div>
		</motion.div>
	)
}
