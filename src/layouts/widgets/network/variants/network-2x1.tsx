import { cn } from '@/common/utils/cn'
import { Icon } from '@/src/icons'

interface NetworkCompactRowProps {
	status: 'online' | 'offline'
	ip: string | null
	countryIcon: string | null
	city: string | null
	isp: string | null
	ping: number | null
	isLoading: boolean
	blurMode: boolean
}

function getPingQuality(ping: number | null) {
	if (ping === null) return 'unknown'
	if (ping < 60) return 'great'
	if (ping < 150) return 'ok'
	return 'poor'
}

export function NetworkCompactRow({
	status,
	ip,
	countryIcon,
	city,
	isp,
	ping,
	isLoading,
	blurMode,
}: NetworkCompactRowProps) {
	const isOnline = status === 'online'
	const pingQuality = getPingQuality(ping)

	if (isLoading) {
		return (
			<div className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none">
				<div className="flex items-center gap-2.5">
					<div className="w-6 h-6 rounded-full skeleton" />
					<div className="flex flex-col gap-1">
						<div className="w-24 h-3.5 rounded skeleton" />
						<div className="w-20 h-3 rounded skeleton" />
					</div>
				</div>
				<div className="w-12 h-4 rounded skeleton" />
			</div>
		)
	}

	return (
		<div
			className={cn(
				'flex items-center justify-between h-full w-full px-3.5 py-2 select-none transition-opacity',
				!isOnline && 'opacity-70'
			)}
		>
			<div
				className={cn(
					'flex items-center gap-2.5 min-w-0',
					blurMode ? 'blur-mode' : 'disabled-blur-mode'
				)}
			>
				<div className="relative shrink-0">
					{countryIcon ? (
						<img
							src={countryIcon}
							alt="flag"
							className="w-6 h-6 rounded-full object-cover ring-1 ring-base-content/10"
						/>
					) : (
						<div className="w-6 h-6 rounded-full bg-base-300 flex items-center justify-center text-xs">
							🌐
						</div>
					)}
					<div
						className={cn(
							'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-base-100',
							isOnline ? 'bg-success' : 'bg-error'
						)}
					/>
				</div>

				<div className="flex flex-col min-w-0">
					<span className="text-xs font-bold text-content truncate" dir="ltr">
						{ip || '---'}
					</span>
					<span className="text-[10px] text-base-content/60 truncate">
						{city ? `${city} · ` : ''}
						{isp || 'ارائه‌دهنده نامشخص'}
					</span>
				</div>
			</div>

			<div className="flex flex-col items-end gap-0.5 shrink-0">
				{isOnline ? (
					<div
						className={cn(
							'flex items-center gap-1 text-xs font-bold',
							pingQuality === 'great' && 'text-success',
							pingQuality === 'ok' && 'text-warning',
							pingQuality === 'poor' && 'text-error',
							pingQuality === 'unknown' && 'text-base-content/60'
						)}
						dir="ltr"
					>
						<Icon name="wifi" size={11} />
						<span>{ping !== null ? ping : '--'}</span>
						<span className="text-[10px] font-normal opacity-60">ms</span>
					</div>
				) : (
					<div className="flex items-center gap-1 text-xs font-bold text-error">
						<Icon name="wifiOff" size={11} />
						<span className="font-normal">قطع</span>
					</div>
				)}
				<span className="text-[9px] text-base-content/40">
					{isOnline ? 'متصل' : 'اتصال ندارد'}
				</span>
			</div>
		</div>
	)
}
