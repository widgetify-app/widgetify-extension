interface SectionHeadingProps {
	id: string
	title: string
	description: string
}

export function SectionHeading({ id, title, description }: SectionHeadingProps) {
	return (
		<div>
			<h3 id={id} className="text-xl font-black text-fg-strong">
				{title}
			</h3>
			<p className="mt-1 text-sm font-medium leading-relaxed text-fg-muted">
				{description}
			</p>
		</div>
	)
}
