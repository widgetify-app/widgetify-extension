import { WidgetContainer } from '../widgets/widget-container'
import { NotificationCenter } from '../widgetify-card/notification-center/notification-center'
import { useGetNotifications } from '@/services/hooks/extension/getNotifications.hook'
import { RenderWigiPadItem } from '../widgets/wigiPad/info-panel/components/ann-item'
import { DateDisplay } from '../widgets/wigiPad/date-display/date.display'
import { ClockDisplay } from '../widgets/wigiPad/clock-display/clock-display'

export function SimplifyYadkar() {
	const { data: fetchedData } = useGetNotifications({})

	const hasBanner = !!fetchedData?.wigipadBanner

	return (
		<WidgetContainer className="relative flex flex-col w-full overflow-hidden h-60 max-h-60!">
			<div className="relative grid justify-between grid-cols-2 rounded-2xl">
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
				<div className="overflow-y-auto scrollbar-none max-h-36 min-h-36">
					<div className="pb-8">
						{fetchedData?.wigiPad?.map((notification, index) => (
							<RenderWigiPadItem
								key={`wigipad-item-${index}`}
								notification={notification}
							/>
						))}
						<NotificationCenter />
					</div>
				</div>
			</div>
		</WidgetContainer>
	)
}
