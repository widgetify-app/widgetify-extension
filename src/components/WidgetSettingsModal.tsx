import { useWidgetVisibility } from '@/context/widget-visibility.context'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { useEffect, useState } from 'react'
import Modal from './modal'

interface WidgetSettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

interface WidgetItem {
	id: string
	emoji: string
	label: string
}

export function WidgetSettingsModal({ isOpen, onClose }: WidgetSettingsModalProps) {
	const { visibility, toggleWidget } = useWidgetVisibility()

	const [activeLeftWidgets, setActiveLeftWidgets] = useState<WidgetItem[]>([])
	const [inactiveLeftWidgets, setInactiveLeftWidgets] = useState<WidgetItem[]>([])

	const [activeBottomWidgets, setActiveBottomWidgets] = useState<WidgetItem[]>([])
	const [inactiveBottomWidgets, setInactiveBottomWidgets] = useState<WidgetItem[]>([])

	const leftColumnWidgets: WidgetItem[] = [
		{ id: 'comboWidget', emoji: '🔗', label: 'ویجت ترکیبی (ارز و اخبار)' },
		{ id: 'arzLive', emoji: '💰', label: 'ویجی ارز' },
		{ id: 'news', emoji: '📰', label: 'ویجی اخبار' },
	]
	const allBottomWidgets: WidgetItem[] = [
		{ id: 'calendar', emoji: '📅', label: 'تقویم' },
		{ id: 'weather', emoji: '🌤️', label: 'آب و هوا' },
		{ id: 'todos', emoji: '✅', label: 'وظایف' },
		{ id: 'tools', emoji: '🧰', label: 'ابزارها' },
		{
			id: 'notes',
			emoji: '📝',
			label: 'یادداشت‌ها',
		},
		{
			id: 'youtube',
			emoji: '📺',
			label: 'آمار یوتیوب',
		},
	]

	useEffect(() => {
		const activeLeft = leftColumnWidgets.filter(
			(widget) => visibility[widget.id as keyof typeof visibility],
		)
		const inactiveLeft = leftColumnWidgets.filter(
			(widget) => !visibility[widget.id as keyof typeof visibility],
		)
		setActiveLeftWidgets(activeLeft)
		setInactiveLeftWidgets(inactiveLeft)

		setActiveBottomWidgets(
			allBottomWidgets.filter(
				(widget) => visibility[widget.id as keyof typeof visibility],
			),
		)

		setInactiveBottomWidgets(
			allBottomWidgets.filter(
				(widget) => !visibility[widget.id as keyof typeof visibility],
			),
		)
	}, [visibility])

	const handleDragEnd = (result: any) => {
		if (!result.destination) return

		const { source, destination } = result
		const sourceId = source.droppableId
		const destId = destination.droppableId

		if (sourceId.startsWith('left-') || destId.startsWith('left-')) {
			handleLeftColumnDragEnd(result)
			return
		}

		if (source.droppableId === destination.droppableId) {
			if (source.droppableId === 'active-widgets') {
				const newList = [...activeBottomWidgets]
				const [movedItem] = newList.splice(source.index, 1)
				newList.splice(destination.index, 0, movedItem)
				setActiveBottomWidgets(newList)
			} else {
				const newList = [...inactiveBottomWidgets]
				const [movedItem] = newList.splice(source.index, 1)
				newList.splice(destination.index, 0, movedItem)
				setInactiveBottomWidgets(newList)
			}
		} else {
			if (source.droppableId === 'active-widgets') {
				const newActiveList = [...activeBottomWidgets]
				const [movedItem] = newActiveList.splice(source.index, 1)

				const newInactiveList = [...inactiveBottomWidgets]
				newInactiveList.splice(destination.index, 0, movedItem)

				setActiveBottomWidgets(newActiveList)
				setInactiveBottomWidgets(newInactiveList)

				toggleWidget(movedItem.id as keyof typeof visibility)
			} else {
				if (activeBottomWidgets.length >= 4) return

				const newInactiveList = [...inactiveBottomWidgets]
				const [movedItem] = newInactiveList.splice(source.index, 1)

				const newActiveList = [...activeBottomWidgets]
				newActiveList.splice(destination.index, 0, movedItem)

				setInactiveBottomWidgets(newInactiveList)
				setActiveBottomWidgets(newActiveList)

				toggleWidget(movedItem.id as keyof typeof visibility)
			}
		}
	}

	const handleLeftColumnDragEnd = (result: any) => {
		const { source, destination } = result

		if (source.droppableId === destination.droppableId) {
			if (source.droppableId === 'left-active-widgets') {
				const newList = [...activeLeftWidgets]
				const [movedItem] = newList.splice(source.index, 1)
				newList.splice(destination.index, 0, movedItem)
				setActiveLeftWidgets(newList)
			} else {
				const newList = [...inactiveLeftWidgets]
				const [movedItem] = newList.splice(source.index, 1)
				newList.splice(destination.index, 0, movedItem)
				setInactiveLeftWidgets(newList)
			}
		} else {
			if (
				source.droppableId === 'left-active-widgets' &&
				destination.droppableId === 'left-inactive-widgets'
			) {
				const newActiveList = [...activeLeftWidgets]
				const [movedItem] = newActiveList.splice(source.index, 1)

				const newInactiveList = [...inactiveLeftWidgets]
				newInactiveList.splice(destination.index, 0, movedItem)

				setActiveLeftWidgets(newActiveList)
				setInactiveLeftWidgets(newInactiveList)

				toggleWidget(movedItem.id as keyof typeof visibility)
			} else if (
				source.droppableId === 'left-inactive-widgets' &&
				destination.droppableId === 'left-active-widgets'
			) {
				if (activeLeftWidgets.length >= 1) return

				const newInactiveList = [...inactiveLeftWidgets]
				const [movedItem] = newInactiveList.splice(source.index, 1)

				const newActiveList = [...activeLeftWidgets]
				newActiveList.splice(destination.index, 0, movedItem)

				setInactiveLeftWidgets(newInactiveList)
				setActiveLeftWidgets(newActiveList)

				toggleWidget(movedItem.id as keyof typeof visibility)
			}
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="⚙️ تنظیمات ویجت"
			size="md"
			direction="rtl"
		>
			<div className="p-2 space-y-2">
				<p className={'text-sm mb-4 widget-item-text'}>
					انتخاب کنید کدام ویجت‌ها در نیـو‌تب شما نمایش داده شوند.
				</p>

				<DragDropContext onDragEnd={handleDragEnd}>
					<div className="space-y-4">
						{/* Left column widgets */}
						<div className="p-3 space-y-3 rounded-lg bg-black/5 dark:bg-white/5">
							<h3 className={'text-sm font-bold mb-2 widget-item-text'}>
								ویجت‌های ستون چپ (حداکثر 1 ویجت)
							</h3>

							<div className="mb-4">
								<p className={'text-xs mb-2 widget-item-text opacity-75'}>
									ویجت فعال ({activeLeftWidgets.length}/1)
								</p>
								<Droppable droppableId="left-active-widgets" direction="horizontal">
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className="flex flex-wrap gap-2 p-3 border border-gray-300 border-dashed rounded-lg min-h-16 dark:border-gray-700"
										>
											{activeLeftWidgets.map((widget, index) => (
												<Draggable
													key={widget.id}
													draggableId={`left-${widget.id}`}
													index={index}
												>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={
																'p-2 rounded-lg cursor-move flex items-center widget-item-background'
															}
														>
															<span className="mr-2">{widget.emoji}</span>
															<span className={'text-sm widget-item-text'}>
																{widget.label}
															</span>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
											{activeLeftWidgets.length === 0 && (
												<div
													className={
														'w-full text-center p-2 widget-item-text opacity-50 text-sm'
													}
												>
													برای فعال کردن ویجت از لیست زیر آن را به اینجا بکشید
												</div>
											)}
										</div>
									)}
								</Droppable>
							</div>

							<div>
								<p className={'text-xs mb-2 widget-item-text opacity-75'}>
									ویجت‌های غیرفعال
								</p>
								<Droppable droppableId="left-inactive-widgets" direction="horizontal">
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className="flex flex-wrap gap-2 p-3 border border-gray-300 border-dashed rounded-lg min-h-16 dark:border-gray-700"
										>
											{inactiveLeftWidgets.map((widget, index) => (
												<Draggable
													key={widget.id}
													draggableId={`left-${widget.id}`}
													index={index}
												>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={
																'p-2 rounded-lg cursor-move flex items-center opacity-70 widget-item-background'
															}
														>
															<span className="mr-2">{widget.emoji}</span>
															<span className={'text-sm widget-item-text'}>
																{widget.label}
															</span>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
											{inactiveLeftWidgets.length === 0 && (
												<div
													className={
														'w-full text-center p-2 widget-item-text opacity-50 text-sm'
													}
												>
													برای غیرفعال کردن ویجت از بالا به اینجا بکشید
												</div>
											)}
										</div>
									)}
								</Droppable>
							</div>

							<div className="pt-3 mt-2 text-xs text-gray-500 opacity-75 dark:text-gray-400">
								فقط یک ویجت می‌تواند در ستون چپ فعال باشد
							</div>
						</div>

						{/* Bottom widgets */}
						<div className="p-3 space-y-3 rounded-lg bg-black/5 dark:bg-white/5">
							<h3 className={'text-sm font-bold mb-2 widget-item-text'}>
								ویجت‌های پایین صفحه (حداکثر 4 ویجت)
							</h3>

							{/* Active widgets */}
							<div className="mb-4">
								<p className={'text-xs mb-2 widget-item-text opacity-75'}>
									ویجت‌های فعال ({activeBottomWidgets.length}/4)
								</p>
								<Droppable droppableId="active-widgets" direction="horizontal">
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className="flex flex-wrap gap-2 p-3 border border-gray-300 border-dashed rounded-lg min-h-16 dark:border-gray-700"
										>
											{activeBottomWidgets.map((widget, index) => (
												<Draggable key={widget.id} draggableId={widget.id} index={index}>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={
																'p-2 rounded-lg cursor-move flex items-center widget-item-background'
															}
														>
															<span className="mr-2">{widget.emoji}</span>
															<span className={'text-sm widget-item-text'}>
																{widget.label}
															</span>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
											{activeBottomWidgets.length === 0 && (
												<div
													className={
														'w-full text-center p-2 widget-item-text opacity-50 text-sm'
													}
												>
													برای فعال کردن ویجت‌ها از لیست زیر آنها را به اینجا بکشید
												</div>
											)}
										</div>
									)}
								</Droppable>
							</div>

							{/* Inactive widgets */}
							<div>
								<p className={'text-xs mb-2 widget-item-text opacity-75'}>
									ویجت‌های غیرفعال
								</p>
								<Droppable droppableId="inactive-widgets" direction="horizontal">
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className="flex flex-wrap gap-2 p-3 border border-gray-300 border-dashed rounded-lg min-h-16 dark:border-gray-700"
										>
											{inactiveBottomWidgets.map((widget, index) => (
												<Draggable key={widget.id} draggableId={widget.id} index={index}>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={
																'p-2 rounded-lg cursor-move flex items-center opacity-70 widget-item-background'
															}
														>
															<span className="mr-2">{widget.emoji}</span>
															<span className={'text-sm widget-item-text'}>
																{widget.label}
															</span>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
											{inactiveBottomWidgets.length === 0 && (
												<div
													className={
														'w-full text-center p-2 widget-item-text opacity-50 text-sm'
													}
												>
													برای غیرفعال کردن ویجت‌ها از بالا به اینجا بکشید
												</div>
											)}
										</div>
									)}
								</Droppable>
							</div>

							<div className="pt-3 mt-4 border-t border-gray-200 dark:border-gray-700">
								<p className={'text-xs widget-item-text opacity-75 mb-2'}>
									ویجت‌های فعال را می‌توانید با کشیدن و رها کردن جابه‌جا کنید. حداکثر 4 ویجت
									می‌توانید همزمان فعال کنید.
								</p>
							</div>
						</div>
					</div>
				</DragDropContext>
			</div>
		</Modal>
	)
}
