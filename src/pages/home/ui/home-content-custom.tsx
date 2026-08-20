import { DateProvider } from '@/context/date.context'
import { FreeWidgetProvider } from '@/context/free-widget.context'
import { FreeWidgetCanvas } from '@/layouts/widgets/canvas/free-widget-canvas'

export function HomeContentCustom() {
	return (
		<DateProvider>
			<FreeWidgetProvider>
				<div
					data-tour="content"
					className="flex flex-col flex-1 w-full overflow-y-auto scrollbar-none"
				>
					<div
						className={`flex flex-col flex-1 w-full pb-20 px-1 md:px-4 py-1 items-start`}
					>
						<div className="w-full max-w-6xl mx-auto">
							<FreeWidgetCanvas />
						</div>
					</div>
				</div>
			</FreeWidgetProvider>
		</DateProvider>
	)
}
