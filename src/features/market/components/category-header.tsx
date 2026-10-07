import type { ReactNode } from 'react'

interface CategoryHeaderProps {
	title: string
	description: string
	children?: ReactNode
}

export function CategoryHeader({ title, description, children }: CategoryHeaderProps) {
	return (
		<header className="flex flex-col gap-3 pb-3 mb-3 border-b border-surface-3">
			<div>
				<h2 className="text-lg font-bold text-fg-strong">{title}</h2>
				<p className="text-xs text-fg-muted">{description}</p>
			</div>
			{children}
		</header>
	)
}
