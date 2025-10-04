import { SectionPanel } from '@/components/section-panel'
import { useAuth } from '@/context/auth.context'
import {
	MAX_VISIBLE_WIDGETS,
	useWidgetVisibility,
	widgetItems,
} from '@/context/widget-visibility.context'
import { ItemSelector } from '../../../components/item-selector'
import { WidgetSettingWrapper } from '../widget-settings-wrapper'

export function ManageWidgets() {
	const { visibility, toggleWidget } = useWidgetVisibility()
	const { isAuthenticated } = useAuth()

	return (
		<WidgetSettingWrapper>
			{!isAuthenticated && (
				<div className="p-3 mb-4 border rounded-lg border-warning/20 bg-warning/10">
					<p className="text-sm text-warning">
						⚠️ کاربران مهمان تنها می‌توانند حداکثر {MAX_VISIBLE_WIDGETS} ویجت
						فعال کنند. برای فعال کردن ویجت‌های بیشتر، وارد حساب کاربری خود
						شوید.
					</p>
				</div>
			)}{' '}
			<SectionPanel title="انتخاب ویجت‌ها برای نمایش" size="sm">
				<div className="grid grid-cols-2 gap-2">
					{widgetItems.map((widget) => {
						const isActive = visibility.includes(widget.id)
						const canToggle =
							isAuthenticated ||
							isActive ||
							visibility.length < MAX_VISIBLE_WIDGETS

						return (
							<ItemSelector
								isActive={isActive}
								key={widget.id}
								className={`w-full ${!canToggle ? 'opacity-50 cursor-not-allowed' : ''}`}
								onClick={() => canToggle && toggleWidget(widget.id)}
								label={`${widget.emoji} ${widget.label} ${widget.isNew ? ' ( جدید )' : ''}`}
							/>
						)
					})}
				</div>
			</SectionPanel>
			<SectionPanel title="ترتیب ویجت‌های فعال" size="sm">
				<div className="flex items-start gap-3 p-3 border rounded-lg bg-primary/10 border-primary/20">
					<span className="text-lg">💡</span>
					<div className="text-sm">
						<p className="mb-1 font-medium text-primary">
							چگونه ترتیب ویجت‌ها را تغییر دهم؟
						</p>
						<p className="leading-relaxed text-muted">
							در صفحه، روی بالای هر ویجت کلیک کرده و آن را بکشید تا ترتیب
							آن‌ها را تغییر دهید. تغییرات به‌صورت خودکار ذخیره می‌شوند.
						</p>
					</div>
				</div>
			</SectionPanel>
		</WidgetSettingWrapper>
	)
}
