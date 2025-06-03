import { useWidgetVisibility, widgetItems } from '@/context/widget-visibility.context'
import { ItemSelector } from './item-selector'
import Modal from './modal'

interface WidgetSettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

export function WidgetSettingsModal({ isOpen, onClose }: WidgetSettingsModalProps) {
	const { visibility, toggleWidget } = useWidgetVisibility()

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="⚙️ تنظیمات ویجت"
			size="lg"
			direction="rtl"
		>
			<div className="p-2 space-y-2 overflow-y-auto">
				<p className={'text-sm mb-4 text-content'}>
					انتخاب کنید کدام ویجت‌ها در نیـو‌تب شما نمایش داده شوند.
				</p>

				<div className="grid grid-cols-2 gap-2 space-y-4">
					{widgetItems.map((widget) => (
						<ItemSelector
							isActive={visibility.includes(widget.id)}
							key={widget.id}
							className="w-full"
							onClick={() => toggleWidget(widget.id)}
							label={`${widget.emoji} ${widget.label}`}
						/>
					))}
				</div>
			</div>
		</Modal>
	)
}
