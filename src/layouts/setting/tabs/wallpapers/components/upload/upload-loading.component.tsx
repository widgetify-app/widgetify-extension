import { IconLoading } from '@/components/ui'

export function UploadLoading() {
	return (
		<div className="relative flex items-center justify-center p-6 border shadow-xs rounded-2xl border-content bg-content">
			<div className="flex items-center gap-2 text-muted">
				<IconLoading className="w-5 h-5 text-primary" />
				<span className="text-xs font-medium">در حال دریافت تنظیمات...</span>
			</div>
		</div>
	)
}
