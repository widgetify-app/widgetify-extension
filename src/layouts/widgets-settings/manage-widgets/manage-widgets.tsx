import { Button, ItemSelector, SectionPanel } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import {
	MAX_VISIBLE_WIDGETS,
	useWidgetVisibility,
	type WidgetItem,
	type WidgetKeys,
	widgetItems,
} from '@/context/widget-visibility.context'
import { WidgetSettingWrapper } from '../widget-settings-wrapper'
import { UI, useAppearanceSetting } from '@/context/appearance.context'
import { Icon } from '@/src/icons'

export function ManageWidgets() {
	const { isAuthenticated } = useAuth()
	const { ui } = useAppearanceSetting()
	const { visibility, toggleWidget } = useWidgetVisibility()

	const isAdvanced = ui === UI.DEFAULT || (ui as string) === 'ADVANCED'

	return (
		<WidgetSettingWrapper>
			{ui === UI.CUSTOM && (
				<SectionPanel title="مدیریت ویجت‌های صفحه" size="sm">
					<div className="flex flex-col items-center justify-center p-6 text-center gap-3 bg-base-300/20 border border-base-content/10 rounded-2xl">
						<div className="p-3 rounded-2xl bg-primary/10 text-primary">
							<Icon name="platforms" size={28} />
						</div>
						<div className="flex flex-col gap-1">
							<p className="text-sm font-bold text-content">
								چیدمان آزادانه روی صفحه
							</p>
							<p className="text-xs text-muted max-w-sm">
								تو این حالت، ویجت ها رو میتونید با ابعاد دلخواه مستقیما
								روی صفحه اضافه یا جابجا کنید
							</p>
						</div>
						<Button
							size="sm"
							variant="primary"
							rounded="2xl"
							className="mt-1 font-bold shadow-sm flex items-center gap-2"
							onClick={() => {
								callEvent('close_all_modals')
								callEvent('openAddCustomWidgetModal')
							}}
						>
							<Icon name="plus" size={14} />
							<span>افزودن ویجت جدید به صفحه</span>
						</Button>
					</div>
				</SectionPanel>
			)}

			{ui === UI.SIMPLE && (
				<SectionPanel title="مدیریت ویجت‌ها" size="sm">
					<div className="flex flex-col items-center justify-center p-6 text-center gap-2 bg-base-300/20 border border-base-content/10 rounded-2xl">
						<p className="text-sm font-medium text-muted">
							حالت ساده برای تمرکز و سرعت طراحی شده و ویجت‌های جانبی نداره
						</p>
					</div>
				</SectionPanel>
			)}

			{isAdvanced && (
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
			)}
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
	const isBeta = widget.isBeta || false

	const finalCanToggle = canToggle && !isDisabled

	let extraClasses = ''
	if (isDisabled) {
		extraClasses += ' border-error/50 bg-error/10'
	}
	if (isSoon) {
		extraClasses += 'border border-warning/50'
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
							<span className="text-white badge badge-primary badge-sm">
								جدید
							</span>
						)}
						{widget.popular && (
							<span className="badge badge-success badge-soft badge-sm">
								محبوب
							</span>
						)}
						{isDisabled && (
							<span className="badge badge-error badge-sm">غیرفعال</span>
						)}
						{isSoon && (
							<span className="badge badge-warning badge-sm">به زودی</span>
						)}
						{isBeta && (
							<span className="badge badge-warning badge-sm">آزمایشی</span>
						)}
					</div>
				</div>
			}
		/>
	)
}
