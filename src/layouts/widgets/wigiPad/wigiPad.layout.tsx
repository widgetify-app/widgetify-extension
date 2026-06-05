import { WidgetContainer } from '../widget-container'
import { ClockDisplay } from './clock-display/clock-display'
import { DateDisplay } from './date-display/date.display'
import { useGetNotifications } from '@/services/hooks/extension/getNotifications.hook'
import { RenderWigiPadItem } from './info-panel/components/ann-item'

export function WigiPadWidget() {
	const { data: fetchedData } = useGetNotifications({
		enabled: true,
	})
	const hasBanner = !!fetchedData?.wigipadBanner

	return (
		<WidgetContainer className="flex flex-col !p-1.5 !h-72 !min-h-72 !max-h-72">
			<div className="relative grid justify-between grid-cols-2 border border-content rounded-2xl">
				{hasBanner ? (
					<>
						<div
							className="absolute inset-0 transition-transform duration-500 scale-100 bg-center bg-cover rounded-2xl"
							style={{
								backgroundImage: `url(${fetchedData?.wigipadBanner})`,
							}}
						/>
						<div className="absolute inset-0 bg-neutral/50 backdrop-blur-[0.7px] rounded-2xl" />
					</>
				) : null}
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
