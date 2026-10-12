import type { ReactNode } from 'react'
import { t } from '@/common/i18n'
import { type IntroNode, parseIntroduction } from '../utils/introduction'

function render(nodes: IntroNode[]): ReactNode[] {
	return nodes.map((node, index) => {
		if (node.kind === 'text') return node.text

		const children = render(node.children)

		switch (node.tag) {
			case 'a':
				return (
					<a
						key={index}
						href={node.href ?? undefined}
						target="_blank"
						rel="noopener noreferrer"
						className="underline text-brand focus-visible:focus-ring"
					>
						{children}
					</a>
				)
			case 'b':
			case 'strong':
				return (
					<strong key={index} className="font-bold">
						{children}
					</strong>
				)
			case 'i':
			case 'em':
				return <em key={index}>{children}</em>
			case 'u':
				return <u key={index}>{children}</u>
			case 'p':
				return (
					<p key={index} className="mt-1 first:mt-0">
						{children}
					</p>
				)
			case 'ul':
				return (
					<ul key={index} className="list-disc ps-4">
						{children}
					</ul>
				)
			case 'ol':
				return (
					<ol key={index} className="list-decimal ps-4">
						{children}
					</ol>
				)
			case 'li':
				return <li key={index}>{children}</li>
			case 'br':
				return <br key={index} />
		}
	})
}

export function WidgetIntroduction({ description }: { description: string }) {
	return (
		<section className="flex flex-col gap-1.5">
			<h4 className="text-2xs font-bold text-fg-muted">
				{t('widgets.catalog.introduction')}
			</h4>

			<div className="text-xs leading-relaxed whitespace-pre-line text-fg wrap-break-word">
				{render(parseIntroduction(description))}
			</div>
		</section>
	)
}
