import type { ReactNode } from 'react'
import { Button, EmptyArt, type EmptyArtName, isEmptyArtName } from '@/components/ui'
import { Icon, type IconName } from '@/icons'

interface WidgetEmptyProps {
	art: IconName | EmptyArtName
	title?: string
	description?: ReactNode
	action?: { label: string; onClick: () => void }
}

export function WidgetEmpty({ art, title, description, action }: WidgetEmptyProps) {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-1.5 px-4 py-3 text-center select-none">
			{isEmptyArtName(art) ? (
				<EmptyArt name={art} className="mb-0.5" />
			) : (
				<span className="grid mb-0.5 place-items-center size-11 rounded-xl bg-fill text-fg-muted">
					<Icon name={art} size={20} aria-hidden="true" />
				</span>
			)}

			{title && <p className="text-xs font-bold text-fg-strong">{title}</p>}

			{description && (
				<p className="leading-relaxed text-2xs text-fg-muted">{description}</p>
			)}

			{action && (
				<Button
					size="xs"
					color="brand"
					rounded="lg"
					className="mt-1"
					onClick={action.onClick}
				>
					{action.label}
				</Button>
			)}
		</div>
	)
}
