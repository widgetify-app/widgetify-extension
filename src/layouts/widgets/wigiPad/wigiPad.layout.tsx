import { WidgetContainer } from '../widget-container'
import { ClockDisplay } from './clock-display/clock-display'
import { DateDisplay } from './date-display/date.display'
import { useGetNotifications } from '@/services/hooks/extension/getNotifications.hook'
import { RenderWigiPadItem } from './info-panel/components/ann-item'

export function WigiPadWidget() {
	const { data: fetchedData } = useGetNotifications({
		enabled: true,
	})

	return (
		<WidgetContainer className="flex flex-col !p-1.5 !h-72 !min-h-72 !max-h-72">
			<div className="relative grid justify-between grid-cols-2 rounded-2xl">
				<DateDisplay />
				<ClockDisplay />
			</div>
			<div className="col-span-2 px-1 mt-1">
				<div className="flex flex-col overflow-y-auto  gap-y-0.5 scrollbar-none h-28 max-h-28 pb-4">
					{fetchedData?.wigiPad.map((notification, index) => (
						<RenderWigiPadItem key={index} notification={notification} />
					))}
				</div>
			</div>
		</WidgetContainer>
	)
}
