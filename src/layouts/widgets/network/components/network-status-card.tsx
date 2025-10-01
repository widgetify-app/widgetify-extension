import { FaExclamationTriangle, FaWifi } from 'react-icons/fa'

interface NetworkStatusCardProps {
	status: 'online' | 'offline'
}

export function NetworkStatusCard({ status }: NetworkStatusCardProps) {
	return (
		<div className="relative p-3 overflow-hidden transition-all duration-200 border border-content rounded-xl bg-gradient-to-r from-base-100 to-base-200/50 hover:shadow-md">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div
						className={`p-1.5 rounded-full ${status === 'online' ? 'bg-green-500/20' : 'bg-red-500/20'}`}
					>
						{status === 'online' ? (
							<FaWifi className="text-sm text-green-500" />
						) : (
							<FaExclamationTriangle className="text-sm text-red-500" />
						)}
					</div>
					<span className="text-xs font-medium text-muted">وضعیت اتصال</span>
				</div>
				<span
					className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
						status === 'online'
							? 'bg-success text-white shadow-green-500/25 shadow-sm'
							: 'bg-error text-white shadow-red-500/25 shadow-sm'
					}`}
				>
					{status === 'online' ? 'آنلاین' : 'آفلاین'}
				</span>
			</div>
		</div>
	)
}
