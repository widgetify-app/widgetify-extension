import { Component, memo, Suspense, type ReactNode } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { WidgetError } from './widget-error'
import { WidgetSkeleton } from './widget-skeleton'
import type { WidgetDefinition, WidgetSize } from '../utils/layout-engine/types'

interface WidgetSlotProps {
	definition: WidgetDefinition
	instanceId: string
	size: WidgetSize
	meta?: any
}

class WidgetErrorBoundary extends Component<
	{ children: ReactNode; widgetKey: string },
	{ failed: boolean }
> {
	override state = { failed: false }

	static getDerivedStateFromError() {
		return { failed: true }
	}

	override componentDidCatch() {
		void Analytics.event('widget_render_failed', {
			widget: this.props.widgetKey,
		}).catch(() => {})
	}

	override render() {
		if (!this.state.failed) return this.props.children
		return (
			<WidgetError
				message={t('widgets.error.loadFailed')}
				onRetry={() => {
					void Analytics.event('widget_render_retried', {
						widget: this.props.widgetKey,
					}).catch(() => {})
					this.setState({ failed: false })
				}}
			/>
		)
	}
}

function WidgetContent({ definition, instanceId, size, meta }: WidgetSlotProps) {
	return (
		<Suspense fallback={<WidgetSkeleton />}>
			{definition.node(instanceId, size, meta)}
		</Suspense>
	)
}

function WidgetSlotImpl(props: WidgetSlotProps) {
	return (
		<WidgetErrorBoundary key={props.instanceId} widgetKey={props.definition.id}>
			<WidgetContent {...props} />
		</WidgetErrorBoundary>
	)
}

export const WidgetSlot = memo(
	WidgetSlotImpl,
	(a, b) =>
		a.definition === b.definition &&
		a.instanceId === b.instanceId &&
		a.size.w === b.size.w &&
		a.size.h === b.size.h &&
		a.meta === b.meta
)
