import { cn } from '@/common/utils/cn'
import { Icon } from '@/src/icons'
import { showToast } from '@/common/toast'

interface NetworkCompactSquareProps {
	status: 'online' | 'offline'
	ping: number | null
	isInitialLoading?: boolean
	isRefreshing?: boolean
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
	isInitialLoading,
	isRefreshing,
	countryIcon,
	ip,
	isp,
	city,
	blurMode,
	onRefresh,
}: NetworkCompactSquareProps) {
	const isOnline = status === 'online'

	const handleCopyIp = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (ip && navigator?.clipboard) {
			navigator.clipboard.writeText(ip).then(() => {
				showToast('آدرس IP کپی شد', 'success')
			})
		}
	}

	if (isInitialLoading) {
		return (
			<div className="flex flex-col justify-between h-full w-full select-none">
				<div className="flex items-center justify-between w-full">
					<div className="w-5 h-5 rounded-full skeleton shrink-0" />
					<div className="w-10 h-4 rounded-full skeleton" />
				</div>
				<div className="flex flex-col items-center justify-center my-auto">
					<div className="w-16 h-7 rounded-lg skeleton mb-1" />
					<div className="w-12 h-2.5 rounded skeleton" />
				</div>
				<div className="w-14 h-3 rounded skeleton mx-auto" />
			</div>
		)
	}

	const pingColor =
		ping !== null
			? ping < 120
				? 'text-success'
				: ping < 250
					? 'text-warning'
					: 'text-error'
			: 'text-content'

	return (
		<div className="relative flex flex-col justify-between h-full w-full select-none text-center">
			<div className="flex items-center justify-between w-full min-w-0">
				{onRefresh && (
					<button
						type="button"
						onClick={onRefresh}
						disabled={isRefreshing}
						className="flex items-center justify-center p-1 rounded-md text-muted hover:text-content hover:bg-base-content/10 transition-all cursor-pointer"
						aria-label="بارگذاری مجدد"
					>
						<Icon
							name="refresh"
							size={11}
							className={cn(
								'text-content opacity-70 hover:opacity-100',
								isRefreshing && 'animate-spin'
							)}
						/>
					</button>
				)}
				<div className="flex items-center gap-1 min-w-0 ms-auto">
					<span className="text-[10px] font-bold text-content truncate max-w-11.25">
						{city || 'شبکه'}
					</span>
					{countryIcon ? (
						<img
							src={countryIcon}
							alt="flag"
							className="w-4 h-4 rounded-full object-cover shrink-0"
						/>
					) : (
						<Icon
							name="network"
							className="w-3.5 h-3.5 text-base-content/70 shrink-0"
						/>
					)}
				</div>
			</div>

			<div className="flex flex-col items-center justify-center my-auto">
				{isRefreshing ? (
					<div className="w-14 h-7 rounded-lg skeleton my-0.5" />
				) : (
					<div className="flex items-baseline gap-0.5 leading-none" dir="ltr">
						<span
							className={cn(
								'text-3xl font-black tracking-tight tabular-nums',
								pingColor
							)}
						>
							{ping !== null ? ping : '--'}
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
						onClick={handleCopyIp}
						disabled={!ip}
						className={cn(
							'text-[10px] font-medium text-muted truncate max-w-full',
							ip
								? 'hover:text-primary active:scale-95 cursor-pointer transition-all'
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
