import { MdRouter } from 'react-icons/md'

interface NetworkIPCardProps {
	ip: string | null
	blurMode: boolean
}

export function NetworkIPCard({ ip, blurMode }: NetworkIPCardProps) {
	return (
		<div className="p-3 transition-all duration-200 border border-content rounded-xl bg-gradient-to-r from-base-100 to-base-200/50 hover:shadow-md">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="p-1.5 rounded-full bg-blue-500/20">
						<MdRouter className="text-sm text-blue-500" />
					</div>
					<span className="text-xs font-medium text-muted">آدرس (IP)</span>
				</div>
				<span
					className={`px-2 py-1 font-mono text-xs font-semibold rounded-md text-content bg-base-200 ${blurMode && 'blur-mode'}`}
				>
					{ip || 'در حال بارگذاری...'}
				</span>
			</div>
		</div>
	)
}
