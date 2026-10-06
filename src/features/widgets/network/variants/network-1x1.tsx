import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { Button } from '@/components/ui'
import { WidgetCenteredHeader } from '@/features/widgets/components/widget-header'
import { WidgetError } from '@/features/widgets/components/widget-error'
import type { NetworkViewProps } from '../types'
import { getPingLabel, getPingTextClass } from '../utils/ping-quality'

export function NetworkCompactSquare(props: NetworkViewProps) {
	return (
		<>
			<WidgetCenteredHeader title="شبکه" />
			<div className="flex flex-col items-center justify-center flex-1 min-h-0 gap-1.5 text-center select-none">
				<NetworkSquareBody {...props} />
			</div>
		</>
	)
}

function NetworkSquareBody({
	info,
	isOnline,
	isAuthenticated,
	isLoading,
	hasError,
	onRefresh,
	onRetryOffline,
}: NetworkViewProps) {
	if (!isAuthenticated) {
		return (
			<>
				<span className="text-2xs text-fg-muted">وارد حسابت نشدی</span>
				<Button
					size="xs"
					color="brand"
					rounded="lg"
					onClick={() => callEvent('openProfile')}
				>
					ورود
				</Button>
			</>
		)
	}

	if (!isOnline) {
		return (
			<>
				<span className="font-semibold text-2xs text-danger">اینترنت قطعه</span>
				<Button size="xs" color="base" rounded="lg" onClick={onRetryOffline}>
					دوباره
				</Button>
			</>
		)
	}

	if (isLoading) {
		return (
			<>
				<div aria-hidden="true" className="h-6 rounded-sm w-14 skeleton" />
				<div aria-hidden="true" className="w-10 h-2.5 rounded-sm skeleton" />
			</>
		)
	}

	if (hasError) {
		return (
			<WidgetError
				message="نتونستیم اطلاعات شبکه رو بیاریم"
				compact
				onRetry={onRefresh}
			/>
		)
	}

	return (
		<>
			<span className="flex items-baseline gap-0.5">
				<span className="text-[32cqh] font-extrabold leading-none tracking-tight tabular-nums text-fg-strong">
					{info.ping ?? '--'}
				</span>
				<span className="font-medium text-3xs text-fg-faint">ms</span>
			</span>
			<span
				className={cn(
					'font-semibold leading-tight text-3xs',
					getPingTextClass(info.ping)
				)}
			>
				{getPingLabel(info.ping)}
			</span>
		</>
	)
}
