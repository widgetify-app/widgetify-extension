import { FiMonitor } from 'react-icons/fi'

interface PermissionRequestProps {
	onRequest: () => void
}

export function PermissionRequest({ onRequest }: PermissionRequestProps) {
	return (
		<div className="flex flex-col items-center justify-center h-screen p-6 text-white bg-gray-900">
			<FiMonitor className="mb-4 text-6xl text-blue-400" />
			<h2 className="mb-2 text-2xl font-bold">نیاز به دسترسی</h2>
			<p className="max-w-md mb-6 text-center text-gray-400">
				برای استفاده از قابلیت Vertical Tabs، نیاز به دسترسی به تب‌های مرورگر
				داریم.
			</p>
			<button
				onClick={onRequest}
				className="px-6 py-2 font-bold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
			>
				اعطای دسترسی
			</button>
		</div>
	)
}
