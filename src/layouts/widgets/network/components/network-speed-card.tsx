import { MdSpeed } from 'react-icons/md'

interface NetworkSpeedCardProps {
	speed: string
}

export function NetworkSpeedCard({ speed }: NetworkSpeedCardProps) {
	return (
		<div className="p-3 transition-all duration-200 border border-content rounded-xl bg-gradient-to-r from-base-100 to-base-200/50 hover:shadow-md opacity-70">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="p-1.5 rounded-full bg-orange-500/20">
						<MdSpeed className="text-sm text-orange-500" />
					</div>
					<span className="text-xs font-medium text-muted">سرعت اینترنت</span>
				</div>
				<span className="px-2 py-1 text-xs font-semibold rounded-md text-muted bg-base-200">
					{speed}
				</span>
			</div>
		</div>
	)
}
