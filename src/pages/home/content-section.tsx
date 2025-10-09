import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Analytics from '@/analytics'
import { useAppearanceSetting } from '@/context/appearance.context'
import { BookmarkProvider } from '@/context/bookmark.context'
import { DateProvider } from '@/context/date.context'
import { TodoProvider } from '@/context/todo.context'
import { useWidgetVisibility, type WidgetItem } from '@/context/widget-visibility.context'
import { BookmarksComponent } from '@/layouts/bookmark/bookmarks'
import { SearchLayout } from '@/layouts/search/search'
import { WidgetifyLayout } from '@/layouts/widgetify-card/widgetify.layout'
import { WigiPadWidget } from '@/layouts/widgets/wigiPad/wigiPad.layout'

const layoutPositions: Record<string, string> = {
	center: 'justify-center',
	top: 'justify-start',
}

function SortableWidget({ widget }: { widget: WidgetItem }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({
			id: widget.id,
			disabled: false,
		})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 999 : 'auto',
	}

	const dragListeners = {
		...listeners,
		onPointerDown: (event: React.PointerEvent) => {
			const target = event.target as HTMLElement
			const isInput =
				target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.contentEditable === 'true' ||
				target.closest('input, textarea, [contenteditable="true"]') ||
				target.closest('button, select, a')

			if (isInput) {
				return
			}

			if (listeners?.onPointerDown) {
				listeners.onPointerDown(event)
			}
		},
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...dragListeners}
			className={`h-widget transition-all duration-200 ${
				isDragging
					? 'opacity-50 scale-105 shadow-2xl cursor-grabbing'
					: 'cursor-grab hover:scale-[1.02]'
			}`}
		>
			{widget.node}
		</div>
	)
}

export function ContentSection() {
	const { contentAlignment } = useAppearanceSetting()
	const { getSortedWidgets, reorderWidgets } = useWidgetVisibility()
	const allSortedWidgets = getSortedWidgets()

	// محدودیت 4 ویجت برای صفحه اصلی
	const MAX_CONTENT_SECTION_WIDGETS = 4
	const sortedWidgets = allSortedWidgets.slice(0, MAX_CONTENT_SECTION_WIDGETS)

	const totalWidgetCount = sortedWidgets.length

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over || active.id === over.id) {
			return
		}

		const oldIndex = sortedWidgets.findIndex((item) => item.id === active.id)
		const newIndex = sortedWidgets.findIndex((item) => item.id === over.id)

		if (oldIndex !== -1 && newIndex !== -1) {
			reorderWidgets(oldIndex, newIndex)
		}

		Analytics.event('widget_reorder')
	}

	let layoutClasses =
		'grid w-full grid-cols-1 gap-2 transition-all duration-300 md:grid-cols-2 lg:grid-cols-4 md:gap-4'
	if (totalWidgetCount === 2) {
		layoutClasses =
			'flex flex-col flex-wrap w-full gap-2 lg:flex-nowrap md:flex-row md:gap-4 justify-between transition-all duration-300 items-center'
	}

	return (
		<DateProvider>
			<TodoProvider>
				<div
					className={`flex flex-col  items-center ${layoutPositions[contentAlignment]} flex-1 w-full gap-4 px-2 md:px-4 py-2`}
				>
					<div className="flex flex-col w-full gap-4 lg:flex-row lg:gap-2">
						<div className="order-3 w-full lg:w-1/4 lg:order-1 h-widget">
							<WidgetifyLayout />
						</div>

						<div
							className={
								'order-1 w-full lg:w-2/4 lg:order-2 lg:px-2 space-y-3'
							}
						>
							<SearchLayout />
							<BookmarkProvider>
								<div className="h-widget">
									<BookmarksComponent />
								</div>
							</BookmarkProvider>
						</div>

						<div className="order-2 w-full lg:w-1/4 lg:order-3 h-widget">
							<WigiPadWidget />
						</div>
					</div>

					{sortedWidgets.length > 0 && (
						<div className="w-full" id="widgets">
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={sortedWidgets.map((widget) => widget.id)}
									strategy={rectSortingStrategy}
								>
									<div className={layoutClasses}>
										{sortedWidgets.map((widget) => {
											if (totalWidgetCount === 2) {
												return (
													<div
														key={widget.id}
														className="flex-shrink-0 w-full lg:w-3/12"
													>
														<SortableWidget widget={widget} />
													</div>
												)
											}
											return (
												<SortableWidget
													key={widget.id}
													widget={widget}
												/>
											)
										})}
									</div>
								</SortableContext>
							</DndContext>
						</div>
					)}
				</div>
			</TodoProvider>
		</DateProvider>
	)
}
