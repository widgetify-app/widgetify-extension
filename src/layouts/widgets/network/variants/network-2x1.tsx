import { Icon } from '@/src/icons'

interface NetworkCompactRowProps {
	status: 'online' | 'offline'
	ip: string | null
	countryIcon: string | null
	city: string | null
	isp: string | null
	ping: number | null
	isLoading: boolean
}

export function NetworkCompactRow({
	status,
	ip,
	countryIcon,
	city,
	isp,
	ping,
	isLoading,
}: NetworkCompactRowProps) {
	const isOnline = status === 'online'

	if (isLoading) {
		return (
			<div className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none">
				<div className="w-24 h-4 rounded skeleton" />
				<div className="w-16 h-4 rounded skeleton" />
			</div>
		)
	}

	return (
		<div className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none">
			<div className="flex items-center gap-2.5 min-w-0">
				{countryIcon ? (
					<img
						src={countryIcon}
						alt="flag"
						className="w-5 h-5 rounded-full object-cover shrink-0"
					/>
				) : (
					<div className="w-5 h-5 rounded-full bg-base-300 flex items-center justify-center text-xs shrink-0">
						🌐
					</div>
				)}

				<div className="flex flex-col min-w-0">
					<div className="flex items-center gap-1.5">
						<span
							className="text-xs font-bold text-content truncate"
							dir="ltr"
						>
							{ip || '---'}
						</span>
					</div>
					<span className="text-[10px] text-base-content/60 truncate">
						{city ? `${city} · ` : ''}
						{isp || 'ارائه‌دهنده نامشخص'}
					</span>
				</div>
			</div>

			<div className="flex flex-col items-end gap-1 shrink-0">
				<div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-base-200/50 text-base-content/70 border border-base-content/10 text-[11px]">
					<span className="text-primary font-bold">
						{ping !== null ? ping : '--'}
					</span>
					<span>ms</span>
				</div>
				<div className="flex items-center gap-1 text-[9px]">
					<div
						className={`w-1.5 h-1.5 rounded-full ${
							isOnline ? 'bg-success animate-pulse' : 'bg-error'
						}`}
					/>
					<span className={isOnline ? 'text-success' : 'text-error'}>
						{isOnline ? 'متصل' : 'قطع'}
					</span>
				</div>
			</div>
		</div>
	)
}
