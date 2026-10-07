import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import React from 'react'
import { cn } from '@/common/utils/cn'
import {
	sectionPanelContentVariants,
	sectionPanelHeaderVariants,
	sectionPanelTitleVariants,
	sectionPanelVariants,
} from './section-panel.variants'

interface SectionPanelProps extends VariantProps<typeof sectionPanelVariants> {
	title: ReactNode
	children: ReactNode
	delay?: number
	icon?: React.ReactElement
	action?: ReactNode
	className?: string
}

export function SectionPanel({
	title,
	children,
	size,
	icon,
	action,
	className,
}: SectionPanelProps) {
	return (
		<div className={cn(sectionPanelVariants({ size }), className)}>
			<div
				className={cn(
					sectionPanelHeaderVariants({ size }),
					'flex items-center justify-between gap-2'
				)}
			>
				<div className="flex items-center gap-2">
					{icon && React.cloneElement(icon, {})}
					<h3 className={sectionPanelTitleVariants({ size })}>{title}</h3>
				</div>
				{action}
			</div>
			<div className={sectionPanelContentVariants({ size })}>{children}</div>
		</div>
	)
}
