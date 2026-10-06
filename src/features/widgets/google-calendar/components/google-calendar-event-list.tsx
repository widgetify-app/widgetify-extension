import type { ReactNode, Ref } from 'react'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { GoogleCalendarRowSkeleton } from './google-calendar-row-skeleton'

interface GoogleCalendarEventListProps {
	isLoading: boolean
	isError: boolean
	isEmpty: boolean
	empty: ReactNode
	onRetry: () => void
	scrollRef?: Ref<HTMLDivElement>
	children: ReactNode
}

export function GoogleCalendarEventList({
	isLoading,
	isError,
	isEmpty,
	empty,
	onRetry,
	scrollRef,
	children,
}: GoogleCalendarEventListProps) {
	return (
		<div
			ref={scrollRef}
			aria-busy={isLoading}
			className="flex-1 min-h-0 overflow-y-auto scrollbar-none"
		>
			{isLoading ? (
				<div className="flex flex-col gap-0.5">
					{Array.from({ length: 4 }, (_, i) => (
						<GoogleCalendarRowSkeleton key={`event-skeleton-${i}`} />
					))}
				</div>
			) : isError ? (
				<WidgetError message="برنامه‌هات دریافت نشدند" onRetry={onRetry} />
			) : isEmpty ? (
				empty
			) : (
				children
			)}
		</div>
	)
}
