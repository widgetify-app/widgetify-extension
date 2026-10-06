import { cn } from '@/common/utils/cn'
import { Tooltip } from '@/components/ui'
import { Icon } from '@/icons'
import { useWidgetMenu } from '../widget-menu.context'

interface WidgetMenuButtonProps {
	placement?: 'header' | 'compact' | 'floating' | 'image'
	tone?: WidgetControlTone
}

export function WidgetMenuButton({
	placement = 'header',
	tone = 'default',
}: WidgetMenuButtonProps) {
	const menu = useWidgetMenu()
	if (!menu) return null

	const isFloating = placement === 'floating'
	const isOnImage = placement === 'image'
	const isSmall = isFloating || isOnImage || placement === 'compact'

	return (
		<Tooltip
			content="گزینه‌های ویجت"
			delay={500}
			className={cn(
				(isFloating || isOnImage) && 'widget-control absolute top-2 left-2 z-30'
			)}
		>
			<button
				type="button"
				aria-label="گزینه‌های ویجت"
				aria-haspopup="menu"
				aria-expanded={menu.isOpen}
				onClick={(e) => menu.toggleFromButton(e.currentTarget)}
				className={cn(
					'grid place-items-center rounded-lg cursor-pointer transition-ui focus-visible:focus-ring',
					isOnImage
						? 'size-6 bg-scrim-soft text-image-fg ring-1 ring-inset ring-image-line backdrop-blur-sm hover:bg-scrim'
						: isFloating
							? 'size-6 bg-glass-surface-3 text-fg-muted hover:bg-fill-3 hover:text-fg-strong'
							: cn(
									isSmall ? 'size-6' : 'size-7',
									controlToneClass(tone, false)
								),
					menu.isOpen && (isOnImage ? 'bg-scrim' : 'bg-fill-3'),
					menu.isOpen && !isOnImage && tone === 'default' && 'text-fg-strong'
				)}
			>
				<Icon name="menuOption" size={isSmall ? 14 : 16} aria-hidden="true" />
			</button>
		</Tooltip>
	)
}

export type WidgetControlTone = 'default' | 'onColor'

export function controlToneClass(tone: WidgetControlTone, isActive: boolean) {
	if (tone === 'onColor') {
		return isActive
			? 'bg-fill-3 text-current'
			: 'text-current opacity-75 hover:opacity-100 hover:bg-fill-2'
	}
	return isActive
		? 'bg-brand-fill text-brand hover:bg-brand-fill-2'
		: 'text-fg-muted hover:bg-fill-2 hover:text-fg-strong'
}
