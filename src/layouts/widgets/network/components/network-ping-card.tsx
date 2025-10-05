import { MdTimer } from 'react-icons/md'

interface NetworkPingCardProps {
	ping: number | null
}

export function NetworkPingCard({ ping }: NetworkPingCardProps) {
	return (
		<div className="p-3 transition-all duration-200 border border-content rounded-xl bg-gradient-to-r from-base-100 to-base-200/50 hover:shadow-md">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="p-1.5 rounded-full bg-purple-500/20">
						<MdTimer className="text-sm text-purple-500" />
					</div>
					<span className="text-xs font-medium text-muted">تاخیر (Ping)</span>
				</div>
				<div className="flex items-center gap-2">
					{ping !== null && (
						<div
							className={`w-2 h-2 rounded-full ${
								ping < 50
									? 'bg-green-500'
									: ping < 100
										? 'bg-yellow-500'
										: 'bg-red-500'
							} animate-pulse`}
						/>
					)}
					<span className="text-xs font-semibold text-content">
						{ping !== null ? `${ping}ms` : 'در حال اندازه‌گیری...'}
					</span>
				</div>
			</div>
		</div>
	)
}
