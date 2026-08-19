import { Icon } from '@/src/icons'

interface NetworkCompactSquareProps {
	status: 'online' | 'offline'
	ping: number | null
	isLoading: boolean
}

export function NetworkCompactSquare({
	status,
	ping,
	isLoading,
}: NetworkCompactSquareProps) {
	const isOnline = status === 'online'

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-between h-full w-full p-2.5 select-none">
				<div className="w-10 h-3 rounded skeleton" />
				<div className="w-14 h-8 rounded skeleton my-auto" />
				<div className="w-12 h-3 rounded skeleton" />
			</div>
		)
	}

	return (
		<div className="relative flex flex-col items-center justify-between h-full w-full p-2.5 text-center select-none">
			<div className="flex items-center gap-1.5 text-content">
				<Icon name="network" className="w-3.5 h-3.5 text-primary" />
				<span className="text-xs font-bold">شبکه</span>
			</div>

			<div className="flex flex-col items-center my-auto">
				<span className="text-2xl font-black text-content leading-none">
					{ping !== null ? `${ping}` : '--'}
					<span className="text-xs font-medium text-base-content/70 mr-0.5">
						ms
					</span>
				</span>
				<span className="text-[10px] text-base-content/60 font-medium mt-1">
					پینگ سرور
				</span>
			</div>

			<div className="flex items-center gap-1 text-[10px] font-medium">
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
	)
}
