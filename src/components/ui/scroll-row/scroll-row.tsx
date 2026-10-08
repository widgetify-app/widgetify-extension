import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'

interface ScrollRowProps {
	children: ReactNode
	gap?: 'sm' | 'md'
	className?: string
}

const EDGE_SLACK_PX = 4

export function ScrollRow({ children, gap = 'sm', className }: ScrollRowProps) {
	const rowRef = useRef<HTMLDivElement>(null)
	const [canScroll, setCanScroll] = useState({ back: false, forward: false })

	const measure = useCallback(() => {
		const row = rowRef.current
		if (!row) return
		const travelled = Math.abs(row.scrollLeft)
		const room = row.scrollWidth - row.clientWidth
		const back = travelled > EDGE_SLACK_PX
		const forward = travelled < room - EDGE_SLACK_PX
		setCanScroll((previous) =>
			previous.back === back && previous.forward === forward
				? previous
				: { back, forward }
		)
	}, [])

	useEffect(() => {
		measure()
	})

	useEffect(() => {
		const row = rowRef.current
		if (!row) return
		const observer = new ResizeObserver(measure)
		observer.observe(row)
		return () => observer.disconnect()
	}, [measure])

	const scrollBy = (forward: boolean) => {
		const row = rowRef.current
		if (!row) return
		const step = row.clientWidth * 0.7
		row.scrollBy({ left: forward ? -step : step, behavior: 'smooth' })
	}

	const edgeButton =
		'absolute top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-full border border-surface-3 bg-surface-2 text-fg-muted shadow-sm cursor-pointer hover:text-fg transition-ui focus-visible:focus-ring'

	return (
		<div className={cn('relative min-w-0', className)}>
			<div
				ref={rowRef}
				onScroll={measure}
				className={cn(
					'flex overflow-x-auto scrollbar-none',
					gap === 'sm' ? 'gap-1.5' : 'gap-3'
				)}
			>
				{children}
			</div>
			{canScroll.back && (
				<button
					type="button"
					aria-label={t('ui.common.previous')}
					onClick={() => scrollBy(false)}
					className={cn(edgeButton, 'start-0')}
				>
					<Icon name="chevronRight" size={14} />
				</button>
			)}
			{canScroll.forward && (
				<button
					type="button"
					aria-label={t('ui.common.next')}
					onClick={() => scrollBy(true)}
					className={cn(edgeButton, 'end-0')}
				>
					<Icon name="chevronLeft" size={14} />
				</button>
			)}
		</div>
	)
}
