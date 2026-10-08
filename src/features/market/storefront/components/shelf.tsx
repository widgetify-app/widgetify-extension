import { t } from '@/common/i18n'
import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'
import { Button, ScrollRow } from '@/components/ui'
import { Icon } from '@/icons'

interface ShelfProps {
	title: string
	onSeeAll: () => void
	wide?: boolean
	children: ReactNode[]
}

export function Shelf({ title, onSeeAll, wide, children }: ShelfProps) {
	if (children.length === 0) return null

	return (
		<section className="flex flex-col gap-2.5">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-bold text-fg-strong">{title}</h3>
				<Button size="xs" variant="ghost" onClick={onSeeAll}>
					{t('market.category.allFilter')}
					<Icon name="chevronLeft" size={12} />
				</Button>
			</div>
			<ScrollRow gap="md">
				{children.map((child, index) => (
					<div key={index} className={cn('shrink-0', wide ? 'w-60' : 'w-52')}>
						{child}
					</div>
				))}
			</ScrollRow>
		</section>
	)
}
