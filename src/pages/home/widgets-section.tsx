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
import { useEffect, useRef, useState } from 'react'
import { TbApps } from 'react-icons/tb'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { DateProvider } from '@/context/date.context'
import { TodoProvider } from '@/context/todo.context'
import {
	type WidgetItem,
	WidgetKeys,
	widgetItems,
} from '@/context/widget-visibility.context'

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

export function WidgetsSection() {
	const [activeTab, setActiveTab] = useState('widgets')
	const contentRef = useRef<HTMLDivElement>(null)
	const [sortedWidgets, setSortedWidgets] = useState<WidgetItem[]>([])

	const BLACK_LIST: WidgetKeys[] = [WidgetKeys.comboWidget]
	const displayWidgets = widgetItems.filter(
		(widget) => !BLACK_LIST.includes(widget.id as WidgetKeys)
	)

	// Load widget order from storage on component mount
	useEffect(() => {
		const loadWidgetOrder = async () => {
			const storedOrder = await getFromStorage('widgetsSectionOrder')
			if (storedOrder && Array.isArray(storedOrder)) {
				// Create a map of stored orders
				const orderMap = new Map(
					storedOrder.map((item: any, index: number) => [item.id, index])
				)

				// Sort widgets based on stored order, fallback to original order
				const sorted = [...displayWidgets].sort((a, b) => {
					const aOrder = orderMap.has(a.id)
						? (orderMap.get(a.id) ?? a.order)
						: a.order
					const bOrder = orderMap.has(b.id)
						? (orderMap.get(b.id) ?? b.order)
						: b.order
					return aOrder - bOrder
				})
				setSortedWidgets(sorted)
			} else {
				// Use original order if no stored order exists
				setSortedWidgets([...displayWidgets].sort((a, b) => a.order - b.order))
			}
		}

		loadWidgetOrder()
	}, [])

	// Save widget order to storage whenever it changes
	const saveWidgetOrder = async (widgets: WidgetItem[]) => {
		const orderData = widgets.map((widget, index) => ({
			id: widget.id,
			order: index,
		}))
		await setToStorage('widgetsSectionOrder', orderData)
	}

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
			const newSortedWidgets = [...sortedWidgets]
			const [draggedWidget] = newSortedWidgets.splice(oldIndex, 1)
			newSortedWidgets.splice(newIndex, 0, draggedWidget)

			setSortedWidgets(newSortedWidgets)
			saveWidgetOrder(newSortedWidgets)
		}

		Analytics.event('widgets_section_reorder')
	}

	const tabs: any[] = [
		{
			label: 'ویجت ها',
			value: 'widgets',
			icon: <TbApps />,
			element: (
				<>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={sortedWidgets.map((widget) => widget.id)}
							strategy={rectSortingStrategy}
						>
							<div className="grid w-full grid-cols-1 gap-2 py-1 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3 md:gap-2">
								{sortedWidgets.map((widget) => (
									<SortableWidget key={widget.id} widget={widget} />
								))}
							</div>
						</SortableContext>
					</DndContext>
				</>
			),
		},
	]

	useEffect(() => {
		if (contentRef.current) {
			contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [activeTab])

	const getTabButtonStyle = (isActive: boolean) => {
		return isActive ? 'text-primary bg-primary/10' : 'text-muted hover:bg-base-300'
	}

	const getTabIconStyle = (isActive: boolean) => {
		return isActive ? 'text-primary' : 'text-muted'
	}

	const handleTabChange = (tabValue: string) => {
		setActiveTab(tabValue)
	}

	return (
		<DateProvider>
			<TodoProvider>
				<div className="flex flex-col md:flex-row h-full gap-0.5 p-2 overflow-hidden">
					<div className="flex w-full h-12 gap-2 p-1 overflow-x-auto rounded-2xl bg-widget widget-wrapper md:flex-col md:w-48 shrink-0 md:overflow-y-auto tab-content-container md:h-72 md:p-2">
						{tabs.map(({ label, value, icon }) => (
							<button
								key={value}
								onClick={() => handleTabChange(value)}
								className={`relative flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] ${getTabButtonStyle(activeTab === value)}`}
							>
								<span className={getTabIconStyle(activeTab === value)}>
									{icon}
								</span>
								<span className="text-sm">{label}</span>
							</button>
						))}
					</div>
					<div
						className="relative flex-1 overflow-x-hidden overflow-y-auto rounded-lg"
						ref={contentRef}
					>
						{tabs.map(({ value, element }) => (
							<div
								key={value}
								className={`absolute inset-0 px-2 rounded-lg transition-all duration-200 ease-in-out  ${
									activeTab === value
										? 'opacity-100 translate-x-0 z-10'
										: 'opacity-0 translate-x-5 z-0 pointer-events-none'
								}`}
							>
								{activeTab === value && element}
							</div>
						))}
					</div>
				</div>
			</TodoProvider>
		</DateProvider>
	)
}
