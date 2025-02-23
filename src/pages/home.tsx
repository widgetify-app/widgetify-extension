import { ArzLiveLayout } from '../layouts/arzLive/arzLive.layout'
import CalendarLayout from '../layouts/calendar/calendar'
import { SearchLayout } from '../layouts/search/search'
import { WeatherLayout } from '../layouts/weather/weather.layout'

export function HomePage() {
	return (
		<div className="flex flex-col gap-4 p-4">
			{/* Top Section */}
			<div className="flex flex-col gap-4 lg:flex-row">
				<div className="order-1 md:basis-128 lg:order-2 lg:flex-1">
					<SearchLayout />
				</div>

				<div className="order-3 md:basis-64 lg:order-1 lg:w-96">
					<div className="p-4 backdrop-blur-md bg-neutral-900/70 rounded-xl">
						<div>Content 1</div>
						<div>Content 2</div>
						<div>Content 3</div>
					</div>
				</div>

				<div className="order-2 md:basis-64 lg:order-3 lg:w-96">
					<ArzLiveLayout />
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-col gap-4 md:flex-row">
				<div className="md:w-2/3">
					<CalendarLayout />
				</div>
				<div className="md:w-1/3">
					<WeatherLayout />
				</div>
			</div>
		</div>
	)
}
//     backdrop-blur-md bg-neutral-900/70 rounded-xl
