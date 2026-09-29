import type { ReactNode } from 'react'
import { Button } from '@/components/ui'
import { Icon, type IconName } from '@/icons'

const ILLUSTRATION_SRC = 'https://cdn.widgetify.ir/system/no-items.png'

interface WidgetEmptyProps {
	art: 'illustration' | IconName
	title?: string
	description?: ReactNode
	action?: { label: string; onClick: () => void }
}

export function WidgetEmpty({ art, title, description, action }: WidgetEmptyProps) {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-2 px-4 py-3 text-center select-none">
			{art === 'illustration' ? (
				<img src={ILLUSTRATION_SRC} alt="" className="object-contain w-12 h-12" />
			) : (
				<Icon name={art} size={20} className="text-fg-muted" aria-hidden="true" />
			)}

			{title && <p className="text-xs font-bold text-fg">{title}</p>}

			{description && (
				<p className="text-3xs leading-5 text-fg-muted">{description}</p>
			)}

			{action && (
				<Button size="xs" color="brand" rounded="xl" onClick={action.onClick}>
					{action.label}
				</Button>
			)}
		</div>
	)
}
