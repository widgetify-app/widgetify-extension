import { Button } from '@/components/ui'
import { Icon, type IconName } from '@/icons'

interface WidgetCompactEmptyProps {
	icon: IconName
	title: string
	description: string
	action?: { label: string; onClick: () => void }
}

export function WidgetCompactEmpty({
	icon,
	title,
	description,
	action,
}: WidgetCompactEmptyProps) {
	return (
		<div className="flex items-center h-full gap-2.5 px-2">
			<span className="grid rounded-xl place-items-center size-9 shrink-0 bg-fill text-fg-muted">
				<Icon name={icon} size={16} aria-hidden="true" />
			</span>
			<div className="flex flex-col flex-1 min-w-0 leading-control">
				<span className="text-xs font-semibold truncate text-fg">{title}</span>
				<span className="truncate text-3xs text-fg-faint">{description}</span>
			</div>
			{action && (
				<Button size="xs" color="brand" rounded="lg" onClick={action.onClick}>
					{action.label}
				</Button>
			)}
		</div>
	)
}
