import { useAppearanceSetting } from '@/context/appearance.context'
import { DateProvider } from '@/context/date.context'
import { useWidgetVisibility } from '@/context/widget-visibility.context'
import { BookmarkProvider } from '@/layouts/bookmark/context/bookmark.context'
import { BookmarksList } from '@/layouts/bookmark/bookmarks'
import { SearchLayout } from '@/layouts/search/search'
import { WidgetifyLayout } from '@/layouts/widgetify-card/widgetify.layout'
import { WigiPadWidget } from '@/layouts/widgets/wigi-pad/wigi-pad.layout'

export function ContentSection() {
	const { contentAlignment } = useAppearanceSetting()
	const { getSortedWidgets } = useWidgetVisibility()
	const sortedWidgets = getSortedWidgets().filter((widget) => !widget.disabled)

	const totalWidgetCount = sortedWidgets.length

	let layoutClasses =
		'grid w-full grid-cols-1 gap-2 transition-all duration-300 md:grid-cols-2 lg:grid-cols-4 md:gap-4'
	if (totalWidgetCount === 2) {
		layoutClasses =
			'flex flex-col flex-wrap w-full gap-2 lg:flex-nowrap md:flex-row md:gap-4 justify-between transition-all duration-300 items-center'
	}

	return (
		<DateProvider>
			<div
				data-tour="content"
				className="flex flex-col flex-1 w-full overflow-y-auto scrollbar-none"
			>
				<div
					className={`flex flex-col flex-1 w-full pb-20 px-1 md:px-4 py-1 ${
						contentAlignment === 'center'
							? 'items-center justify-center'
							: 'items-start'
					}`}
				>
					<div className="flex flex-col w-full max-w-6xl gap-4 lg:flex-row lg:gap-2">
						<div className="order-3 w-full lg:w-xs lg:order-1 h-72">
							<WidgetifyLayout />
						</div>

						<div className="order-1 w-full lg:w-[65%] lg:order-2 space-y-2 px-1">
							<SearchLayout />
							<BookmarkProvider>
								<BookmarksList />
							</BookmarkProvider>
						</div>

						<div className="order-2 w-full lg:w-xs lg:order-3 h-72">
							<WigiPadWidget />
						</div>
					</div>

					{sortedWidgets.length > 0 && (
						<div className="w-full max-w-6xl mt-2" id="widgets">
							<div className={layoutClasses}>
								{sortedWidgets.map((widget) => {
									if (totalWidgetCount === 2) {
										return (
											<div
												key={widget.id}
												className="flex-shrink-0 w-full lg:w-62.5 h-80"
											>
												{widget.node}
											</div>
										)
									}
									return (
										<div key={widget.id} className="h-80 w-full">
											{widget.node}
										</div>
									)
								})}
							</div>
						</div>
					)}
				</div>
			</div>
		</DateProvider>
	)
}
