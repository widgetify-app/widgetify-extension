import { Icon } from '@/src/icons'

interface ProTooltipProps {
	vipMaxSize: number
}

export function ProTooltipContent({ vipMaxSize }: ProTooltipProps) {
	return (
		<div className="flex flex-col gap-2 p-1 text-right min-w-56">
			<div className="flex items-center gap-1.5 pb-1.5 border-b border-base-content/10">
				<span className="flex items-center justify-center w-5 h-5 text-indigo-500 rounded-md bg-indigo-500/15">
					<Icon name="crown" size={12} />
				</span>
				<span className="text-xs font-bold text-content">امکانات نسخه پرو</span>
			</div>
			<div className="flex flex-col gap-1.5 text-[11px] text-muted">
				<div className="flex items-center gap-1.5">
					<Icon name="check" size={12} className="text-success shrink-0" />
					<span>عکس، گیف و ویدیو تا {vipMaxSize} مگابایت</span>
				</div>
				<div className="flex items-center gap-1.5">
					<Icon name="check" size={12} className="text-success shrink-0" />
					<span>ذخیره ابری بدون اشغال حافظه مرورگر</span>
				</div>
				<div className="flex items-center gap-1.5">
					<Icon name="check" size={12} className="text-success shrink-0" />
					<span>همگام‌سازی خودکار روی تمام دستگاه‌ها</span>
				</div>
			</div>
		</div>
	)
}
