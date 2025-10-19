import { SectionPanel } from '@/components/section-panel'
import { useAuth } from '@/context/auth.context'
import {
	MAX_VISIBLE_WIDGETS,
	useWidgetVisibility,
	type WidgetItem,
	type WidgetKeys,
	widgetItems,
} from '@/context/widget-visibility.context'
import { ItemSelector } from '../../../components/item-selector'
import { WidgetSettingWrapper } from '../widget-settings-wrapper'

export function ManageWidgets() {
	const { isAuthenticated } = useAuth()
	const { visibility, toggleWidget } = useWidgetVisibility()
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
					{widgetItems.map((widget) => (
						<WidgetItemComponent
							widget={widget}
							key={widget.id + 'selector'}
							visibility={visibility}
							toggleWidget={toggleWidget}
							isAuthenticated={isAuthenticated}
						/>
					))}
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

interface WidgetItemComponentProps {
	widget: WidgetItem
	visibility: string[]
	toggleWidget: (widgetId: WidgetKeys) => void
	isAuthenticated: boolean
}

function WidgetItemComponent({
	widget,
	visibility,
	toggleWidget,
	isAuthenticated,
}: WidgetItemComponentProps) {
	const isActive = visibility.includes(widget.id)
	const canToggle =
		isAuthenticated || isActive || visibility.length < MAX_VISIBLE_WIDGETS

	const isDisabled = widget.disabled || false
	const isSoon = widget.soon || false

	const finalCanToggle = canToggle && !isDisabled

	let extraClasses = ''
	if (isDisabled) {
		extraClasses += ' border-red-500/50 bg-red-500/10'
	}
	if (isSoon) {
		extraClasses += ' border-warning/50 bg-warning/10'
	}

	return (
		<ItemSelector
			isActive={isActive && finalCanToggle}
			key={widget.id}
			className={`w-full ${!finalCanToggle ? '!pointer-events-none' : ''}${extraClasses} !h-12 !max-h-12 overflow-hidden`}
			onClick={() => finalCanToggle && toggleWidget(widget.id)}
			label={
				<div className="flex items-center gap-2">
					<span
						className={`text-xs ${!finalCanToggle ? 'text-muted' : ''} truncate`}
					>
						{widget.emoji} {widget.label}
					</span>
					<div className="flex gap-0.5">
						{widget.isNew && (
							<span className="text-white badge badge-primary badge-xs">
								جدید
							</span>
						)}
						{widget.popular && (
							<span className="badge badge-success badge-soft badge-sm">
								محبوب
							</span>
						)}
						{isDisabled && (
							<span className="badge badge-error badge-xs">غیرفعال</span>
						)}
						{isSoon && (
							<span className="badge badge-warning badge-xs">به زودی</span>
						)}
					</div>
				</div>
			}
		/>
	)
}
