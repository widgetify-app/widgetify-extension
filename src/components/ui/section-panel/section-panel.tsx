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

export interface SectionPanelProps extends VariantProps<typeof sectionPanelVariants> {
	title: ReactNode
	children: ReactNode
	delay?: number
	icon?: React.ReactElement
	className?: string
}

export function SectionPanel({
	title,
	children,
	size,
	icon,
	className,
}: SectionPanelProps) {
	return (
		<div className={cn(sectionPanelVariants({ size }), className)}>
			<div className={sectionPanelHeaderVariants({ size })}>
				<div className="flex items-center gap-2">
					{icon && React.cloneElement(icon, {})}
					<h3 className={sectionPanelTitleVariants({ size })}>{title}</h3>
				</div>
			</div>
			<div className={sectionPanelContentVariants({ size })}>{children}</div>
		</div>
	)
}
