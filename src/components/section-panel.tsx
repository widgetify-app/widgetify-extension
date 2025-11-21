import type { ReactNode } from 'react'
import React from 'react'

interface SectionPanelProps {
	title: ReactNode
	children: ReactNode
	delay?: number
	size?: 'xs' | 'sm' | 'md' | 'lg'
	icon?: React.ReactElement
}

export function SectionPanel({ title, children, size = 'md', icon }: SectionPanelProps) {
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
		<div className={`overflow-hidden ${sizeStyles.container} duration-300`}>
			<div className={`${sizeStyles.header} border-b border-content`}>
				<div className="flex items-center justify-between gap-2">
					<h3 className={`font-medium ${sizeStyles.title} text-content`}>
						{title}
					</h3>
					{icon && React.cloneElement(icon, {})}
				</div>
			</div>
			<div className={sizeStyles.content}>{children}</div>
		</div>
	)
}
