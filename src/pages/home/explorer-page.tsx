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
import { TbArrowLeft, TbLayoutGrid } from 'react-icons/tb'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { DateProvider } from '@/context/date.context'
import { TodoProvider } from '@/context/todo.context'
import { type WidgetItem, widgetItems } from '@/context/widget-visibility.context'

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

export function ExplorerPage() {
	const [activeTab, setActiveTab] = useState('widgets')
	const contentRef = useRef<HTMLDivElement>(null)
	const [sortedWidgets, setSortedWidgets] = useState<WidgetItem[]>([])

	const displayWidgets = widgetItems

	useEffect(() => {
		const loadWidgetOrder = async () => {
			const storedOrder = await getFromStorage('explorerPageOrder')
			if (storedOrder && Array.isArray(storedOrder)) {
				const orderMap = new Map(
					storedOrder.map((item: any, index: number) => [item.id, index])
				)

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
				setSortedWidgets([...displayWidgets].sort((a, b) => a.order - b.order))
			}
		}

		loadWidgetOrder()
	}, [])

	const saveWidgetOrder = async (widgets: WidgetItem[]) => {
		const orderData = widgets.map((widget, index) => ({
			id: widget.id,
			order: index,
		}))
		await setToStorage('explorerPageOrder', orderData)
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

		Analytics.event('explorer_page_reorder')
	}

	const handleBackToHome = () => {
		callEvent('switchToHomePage', null)
		Analytics.event('navigate_to_home_from_explorer')
	}

	const tabs = [
		{
			id: 'widgets',
			label: 'ویجت‌ها',
			icon: <TbLayoutGrid size={20} />,
			content: (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={sortedWidgets.map((widget) => widget.id)}
						strategy={rectSortingStrategy}
					>
						<div className="grid w-full grid-cols-1 gap-3 py-2 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3">
							{sortedWidgets.map((widget) => (
								<SortableWidget key={widget.id} widget={widget} />
							))}
						</div>
					</SortableContext>
				</DndContext>
			),
		},
		{
			id: 'back',
			label: 'بازگشت',
			icon: <TbArrowLeft size={20} />,
			content: null,
			action: handleBackToHome,
		},
	]

	useEffect(() => {
		if (contentRef.current) {
			contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [activeTab])

	return (
		<DateProvider>
			<TodoProvider>
				<div className="flex flex-col h-full gap-3 px-2 overflow-hidden lg:flex-row">
					<div className="flex w-full gap-2 py-1 overflow-x-hidden lg:w-44 lg:flex-col">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => {
									if (tab.action) {
										tab.action()
									} else {
										setActiveTab(tab.id)
									}
									Analytics.event('explorer_tab_switch', {
										tab: tab.id,
									})
								}}
								className={`flex items-center cursor-pointer gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
									activeTab === tab.id
										? 'bg-primary text-white shadow-lg'
										: 'bg-content hover:!bg-primary/80 text-muted hover:!text-white'
								}`}
							>
								{tab.icon}
								<span className="text-sm font-bold">{tab.label}</span>
							</button>
						))}
					</div>
					<div className="flex-1 overflow-hidden">
						<div
							className="h-full overflow-x-hidden overflow-y-auto hide-scrollbar rounded-xl bg-widget/30"
							ref={contentRef}
						>
							{tabs.find((tab) => tab.id === activeTab)?.content}
						</div>
					</div>
				</div>
			</TodoProvider>
		</DateProvider>
	)
}
