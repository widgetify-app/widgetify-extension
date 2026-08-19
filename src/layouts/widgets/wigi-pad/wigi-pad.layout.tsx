import { WidgetContainer } from '../widget-container'
import { ClockDisplay } from './clock-display/clock-display'
import { DateDisplay } from './date-display/date.display'
import { useGetNotifications } from '@/services/hooks/extension/get-notifications.hook'
import { RenderWigiPadItem } from './info-panel/components/ann-item'

import type { WidgetSize } from '../layout-engine/types'

interface WigiPadWidgetProps {
	size?: WidgetSize
}

export function WigiPadWidget({ size }: WigiPadWidgetProps = {}) {
	const { data: fetchedData } = useGetNotifications()

	return (
		<WidgetContainer className="flex flex-col !p-1.5 h-full">
			<div className="relative grid justify-between grid-cols-2 rounded-2xl">
				<DateDisplay />
				<ClockDisplay />
			</div>
			<div className="col-span-2 px-1 mt-1 flex-1 overflow-hidden">
				<div className="flex flex-col overflow-y-auto gap-y-0.5 pl-0.5 h-full pb-4 scrollbar-none">
					{fetchedData?.wigiPad.map((notification, index) => (
						<RenderWigiPadItem key={index} notification={notification} />
					))}
				</div>
			</div>
		</WidgetContainer>
	)
}
