import { Icon } from '@/src/icons'

interface NetworkWideBannerProps {
	status: 'online' | 'offline'
	ip: string | null
	countryIcon: string | null
	city: string | null
	isp: string | null
	ping: number | null
	isLoading: boolean
}

export function NetworkWideBanner({
	status,
	ip,
	countryIcon,
	city,
	isp,
	ping,
	isLoading,
}: NetworkWideBannerProps) {
	const isOnline = status === 'online'

	if (isLoading) {
		return (
			<div className="flex items-center justify-between h-full w-full px-4 py-2 select-none">
				<div className="w-24 h-4 rounded skeleton" />
				<div className="w-36 h-4 rounded skeleton" />
				<div className="w-20 h-4 rounded skeleton" />
			</div>
		)
	}

	return (
		<div className="flex items-center justify-between h-full w-full px-4 py-2 select-none">
			<div className="flex items-center gap-3 shrink-0">
				<div className="flex items-center gap-1.5 font-bold text-xs text-content">
					<Icon name="network" className="w-4 h-4 text-primary" />
					<span>وضعیت شبکه</span>
				</div>

				<div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-base-200/60 border border-base-content/10 text-xs">
					<div
						className={`w-2 h-2 rounded-full ${
							isOnline ? 'bg-success animate-pulse' : 'bg-error'
						}`}
					/>
					<span
						className={
							isOnline
								? 'text-success font-medium'
								: 'text-error font-medium'
						}
					>
						{isOnline ? 'اینترنت متصل' : 'عدم اتصال'}
					</span>
				</div>
			</div>

			<div
				className="flex items-center gap-2 text-xs text-base-content/80"
				dir="ltr"
			>
				{countryIcon && (
					<img
						src={countryIcon}
						alt="flag"
						className="w-4 h-4 rounded-full object-cover shrink-0"
					/>
				)}
				<span>{ip || '---'}</span>
				{city && <span className="text-base-content/50">({city})</span>}
			</div>

			<div className="flex items-center gap-3 text-xs shrink-0">
				{isp && (
					<span className="text-base-content/60 truncate max-w-32 hidden md:inline">
						{isp}
					</span>
				)}
				<div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-base-200/50 text-base-content/70 border border-base-content/10 text-xs">
					<span className="text-primary font-bold">
						{ping !== null ? ping : '--'}
					</span>
					<span>ms</span>
				</div>
			</div>
		</div>
	)
}
