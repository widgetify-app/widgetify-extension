import { cn } from '@/common/utils/cn'
import { Button } from '@/components/ui'
import { Icon } from '@/icons'
import { NetworkError } from '../components'
import { copyIpToClipboard } from '../utils/copy-ip'
import { getPingTextClass } from '../utils/ping-quality'

interface NetworkCompactSquareProps {
	status: 'online' | 'offline'
	ping: number | null
	isAuthenticated: boolean
	isInitialLoading?: boolean
	isRefreshing?: boolean
	hasError?: boolean
	countryIcon?: string | null
	ip?: string | null
	isp?: string | null
	city?: string | null
	blurMode?: boolean
	onRefresh?: () => void
}

export function NetworkCompactSquare({
	status,
	ping,
	isAuthenticated,
	isInitialLoading,
	isRefreshing,
	hasError,
	countryIcon,
	ip,
	isp,
	city,
	blurMode,
	onRefresh,
}: NetworkCompactSquareProps) {
	const isOnline = status === 'online'

	if (isInitialLoading) {
		return (
			<div
				aria-hidden="true"
				className="flex flex-col justify-between w-full h-full select-none"
			>
				<div className="flex items-center justify-between w-full">
					<div className="w-5 h-5 rounded-full skeleton shrink-0" />
					<div className="w-10 h-4 rounded-full skeleton" />
				</div>
				<div className="flex flex-col items-center justify-center my-auto">
					<div className="mb-1 rounded-lg w-16 h-7 skeleton" />
					<div className="w-12 h-2.5 rounded skeleton" />
				</div>
				<div className="h-3 mx-auto rounded w-14 skeleton" />
			</div>
		)
	}

	if (!isAuthenticated) {
		return (
			<div className="flex flex-col items-center justify-center w-full h-full gap-1 p-2 text-center select-none">
				<Icon name="network" size={16} className="text-muted" aria-hidden="true" />
				<span className="text-[10px] leading-tight text-muted">
					برای دیدن وضعیت شبکه وارد حسابت شو
				</span>
			</div>
		)
	}

	if (hasError && onRefresh) {
		return <NetworkError compact onRetry={onRefresh} />
	}

	return (
		<div className="relative flex flex-col justify-between w-full h-full text-center select-none group">
			<div className="flex items-center justify-between w-full min-w-0">
				{onRefresh && (
					<Button
						variant="ghost"
						size="xs"
						onClick={onRefresh}
						disabled={isRefreshing}
						className="flex items-center justify-center w-5 h-5 p-0 border-none rounded-md cursor-pointer text-muted transition-ui opacity-0 hover:text-base-content hover:bg-base-content/10 group-hover:opacity-100 focus-visible:focus-ring"
						aria-label="بارگذاری مجدد"
					>
						<Icon
							name="refresh"
							size={11}
							aria-hidden="true"
							className={cn(
								'text-content opacity-70',
								isRefreshing && 'animate-spin'
							)}
						/>
					</Button>
				)}
				<div className="flex items-center min-w-0 gap-1 ms-auto">
					<span className="text-[10px] font-bold text-content truncate max-w-11.25">
						{city || 'شبکه'}
					</span>
					{countryIcon ? (
						<img
							src={countryIcon}
							alt=""
							className="object-cover w-4 h-4 rounded-full shrink-0"
						/>
					) : (
						<Icon
							name="network"
							aria-hidden="true"
							className="w-3.5 h-3.5 text-muted shrink-0"
						/>
					)}
				</div>
			</div>

			<div className="flex flex-col items-center justify-center my-auto">
				{isRefreshing ? (
					<div
						aria-hidden="true"
						className="rounded-lg w-14 h-7 skeleton my-0.5"
					/>
				) : (
					<div className="flex items-baseline gap-0.5 leading-none" dir="ltr">
						<span
							className={cn(
								'text-3xl font-black tracking-tight tabular-nums',
								getPingTextClass(ping)
							)}
						>
							{ping !== null ? <data value={ping}>{ping}</data> : '--'}
						</span>
						<span className="text-[11px] font-bold text-muted">ms</span>
					</div>
				)}
			</div>

			<div
				className={cn(
					'w-full flex items-center justify-center text-center',
					blurMode ? 'blur-mode' : 'disabled-blur-mode'
				)}
			>
				{isOnline ? (
					<button
						type="button"
						onClick={() => copyIpToClipboard(ip ?? null)}
						disabled={!ip}
						aria-label={ip ? `کپی آدرس ${ip}` : undefined}
						className={cn(
							'text-[10px] font-medium text-muted truncate max-w-full',
							ip
								? 'hover:text-primary active:scale-95 cursor-pointer transition-ui focus-visible:focus-ring'
								: 'cursor-default'
						)}
						dir="ltr"
					>
						{ip || isp || 'آنلاین'}
					</button>
				) : (
					<span className="text-[10px] font-medium text-error truncate max-w-full">
						عدم دسترسی
					</span>
				)}
			</div>
		</div>
	)
}
