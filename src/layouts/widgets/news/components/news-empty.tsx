import { callEvent } from '@/common/utils/call-event'
import { Icon } from '@/icons'
import { WidgetTabKeys } from '@/layouts/widgets-settings/tab-keys'

export function NewsEmpty() {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-2 px-4 py-6 text-center select-none">
			<Icon
				name="outlineNewspaper"
				size={22}
				className="text-muted"
				aria-hidden="true"
			/>

			<p className="text-xs font-bold text-content">هیچ منبع خبری فعالی نداری</p>

			<p className="text-[.65rem] leading-5 text-muted">
				منابع پیش‌فرض رو روشن کن یا یک فید دلخواه اضافه کن
			</p>

			<button
				type="button"
				onClick={() =>
					callEvent('openWidgetsSettings', { tab: WidgetTabKeys.news_settings })
				}
				className="px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer text-content bg-hovered transition-ui hover:bg-strong focus-visible:focus-ring"
			>
				تنظیمات اخبار
			</button>
		</div>
	)
}
