import { Icon } from '@/icons'

interface Prop {
	template: string
	className?: string
}
export function renderBrowserTitlePreview(item: Prop) {
	const isPersian = /[\u0600-\u06FF]/.test(item.template)
	return (
		<div
			className={`flex items-center justify-between w-40 p-1.5 text-xs font-medium border shadow-sm text-fg bg-surface-2 border-surface-3 rounded-t-lg max-w-40 ${item.className || ''} font-sans`}
		>
			<div className="flex items-center gap-1">
				<Icon name="close" />
				{isPersian && <span className="text-3xs truncate">{item.template}</span>}
			</div>
			<div className="flex items-center gap-1">
				{!isPersian && (
					<span className="text-3xs truncate" dir="ltr">
						{item.template}
					</span>
				)}
				<img src="./icons/icon16.png" alt="Icon" className="w-4 h-4" />
			</div>
		</div>
	)
}
