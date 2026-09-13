import { cn } from '@/common/utils/cn'
import { Button } from '@/components/ui'
import { Icon } from '@/icons'
import { showToast } from '@/common/toast'

interface NetworkCompactRowProps {
	status: 'online' | 'offline'
	ip: string | null
	countryIcon: string | null
	city: string | null
	isp: string | null
	ping: number | null
	isLoading: boolean
	blurMode: boolean
	onRefresh?: () => void
}

function getPingQuality(ping: number | null) {
	if (ping === null) return 'unknown'
	if (ping < 80) return 'great'
	if (ping < 160) return 'ok'
	return 'poor'
}

function cleanIspName(isp: string | null): string {
	if (!isp) return 'نامشخص'

	const name = isp
		.replace(/\(.*?\)/g, '')
		.replace(/Company|Co\.|LLC|Inc\.|Corp\.|Ltd\.|Joint Stock/gi, '')
		.trim()

	return name || isp
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
	onRefresh,
}: NetworkCompactRowProps) {
	const isOnline = status === 'online'
	const pingQuality = getPingQuality(ping)

	const handleCopyIp = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (ip && navigator?.clipboard) {
			navigator.clipboard.writeText(ip).then(() => {
				showToast('آدرس IP کپی شد', 'success')
			})
		}
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none">
				<div className="flex flex-col flex-1 gap-2">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded skeleton" />
						<div className="h-3 rounded w-14 skeleton" />
						<div className="w-24 h-3.5 rounded skeleton" />
					</div>
					<div className="flex items-center gap-2">
						<div className="w-10 h-3 rounded skeleton" />
						<div className="w-20 h-3 rounded skeleton" />
					</div>
				</div>
				<div className="w-8 h-8 rounded-full skeleton shrink-0" />
			</div>
		)
	}

	const displayIsp = cleanIspName(isp)

	return (
		<div
			className={cn(
				'relative group flex items-center justify-between h-full w-full px-3.5 py-2 select-none overflow-hidden transition-opacity',
				!isOnline && 'opacity-75'
			)}
		>
			<div className="flex flex-col justify-center flex-1 min-w-0 gap-1 pl-2">
				<div className="flex items-center min-w-0 gap-2">
					{isOnline ? (
						<div
							className={cn(
								'flex items-center gap-1 text-[11px] font-bold shrink-0',
								pingQuality === 'great' && 'text-success',
								pingQuality === 'ok' && 'text-warning',
								pingQuality === 'poor' && 'text-error',
								pingQuality === 'unknown' && 'text-muted'
							)}
							dir="ltr"
						>
							<Icon name="wifi" size={13} className="shrink-0" />
							<span>{ping !== null ? ping : '--'}</span>
							<span className="text-[9px] font-medium opacity-70">ms</span>
						</div>
					) : (
						<div className="flex items-center gap-1 text-[11px] font-bold text-error shrink-0">
							<Icon name="wifiOff" size={13} className="shrink-0" />
							<span>قطع</span>
						</div>
					)}

					<span className="text-xs select-none text-base-content/20 shrink-0">
						•
					</span>

					<button
						type="button"
						onClick={handleCopyIp}
						title="کپی آدرس IP"
						className={cn(
							'flex items-center gap-1 font-mono text-xs font-semibold tracking-tight text-content hover:text-primary transition-colors truncate cursor-pointer',
							blurMode ? 'blur-mode' : 'disabled-blur-mode'
						)}
						dir="ltr"
					>
						<span>{ip || '---'}</span>
					</button>
				</div>

				<div className="flex items-center gap-1.5 text-[11px] text-muted truncate">
					<span
						className={cn(
							'font-medium shrink-0',
							isOnline ? 'text-success' : 'text-error'
						)}
					>
						{isOnline ? 'متصل' : 'اتصال ندارد'}
					</span>

					<span className="opacity-30">•</span>

					<span
						className="truncate text-muted text-[10px]"
						title={isp || undefined}
					>
						{city ? `${city}، ` : ''}
						{displayIsp}
					</span>
				</div>
			</div>

			<div className="relative flex items-center justify-center shrink-0">
				<div className="relative">
					{countryIcon ? (
						<img
							src={countryIcon}
							alt="پرچم کشور"
							className="object-cover w-8 h-8 rounded-full shadow-xs ring-2 ring-base-content/10"
						/>
					) : (
						<div className="flex items-center justify-center w-8 h-8 text-sm border rounded-full shadow-xs bg-base-300/60 border-base-content/10">
							🌐
						</div>
					)}

					<span
						className={cn(
							'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-base-100 shadow-xs',
							isOnline ? 'bg-success' : 'bg-error'
						)}
					/>
				</div>

				{onRefresh && (
					<Button
						size="xs"
						onClick={(e) => {
							e.stopPropagation()
							onRefresh()
						}}
						aria-label="بارگذاری مجدد"
						className="absolute flex items-center justify-center w-5 h-5 min-h-0 p-0 transition-all rounded-full shadow-xs opacity-0 cursor-pointer group-hover:opacity-100 -top-1 -left-1 bg-content"
						variant={'ghost'}
					>
						<Icon name="refresh" size={10} />
					</Button>
				)}
			</div>
		</div>
	)
}
