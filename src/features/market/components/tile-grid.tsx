import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'

interface TileGridProps {
	wide?: boolean
	children: ReactNode
}

export function TileGrid({ wide, children }: TileGridProps) {
	return (
		<div
			className={cn(
				'grid gap-3',
				wide
					? 'grid-cols-[repeat(auto-fill,minmax(13rem,1fr))]'
					: 'grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))]'
			)}
		>
			{children}
		</div>
	)
}

export function TileSkeletons({ count, wide }: { count: number; wide?: boolean }) {
	return (
		<TileGrid wide={wide}>
			{Array.from({ length: count }, (_, index) => (
				<span
					key={index}
					aria-hidden="true"
					className={cn(
						'block rounded-2xl skeleton',
						wide ? 'aspect-[2/1]' : 'aspect-video'
					)}
				/>
			))}
		</TileGrid>
	)
}
