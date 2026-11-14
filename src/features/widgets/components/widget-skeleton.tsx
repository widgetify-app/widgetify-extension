import { WidgetContainer } from './widget-container'

export function WidgetSkeleton() {
	return (
		<WidgetContainer>
			<div className="size-full rounded-lg skeleton bg-fill" aria-hidden="true" />
		</WidgetContainer>
	)
}
