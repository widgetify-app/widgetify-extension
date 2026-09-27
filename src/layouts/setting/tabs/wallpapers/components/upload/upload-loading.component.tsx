import { IconLoading } from '@/components/ui'

export function UploadLoading() {
	return (
		<div className="relative flex items-center justify-center p-6 border shadow-xs rounded-2xl border-surface-3 bg-surface-2">
			<div className="flex items-center gap-2 text-fg-muted">
				<IconLoading className="w-5 h-5 text-brand" />
				<span className="text-xs font-medium">در حال دریافت تنظیمات...</span>
			</div>
		</div>
	)
}
