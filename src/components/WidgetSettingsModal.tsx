import { getTextColor, useTheme } from '@/context/theme.context'
import { useWidgetVisibility } from '@/context/widget-visibility.context'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { useEffect, useState } from 'react'
import CustomCheckbox from './checkbox'
import Modal from './modal'

interface WidgetSettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

// Define widget data structure
interface WidgetItem {
	id: string
	emoji: string
	label: string
	disabled?: boolean
	disabledMessage?: string
}

export function WidgetSettingsModal({ isOpen, onClose }: WidgetSettingsModalProps) {
	const { visibility, toggleWidget } = useWidgetVisibility()
	const { theme } = useTheme()

	const [bottomWidgets, setBottomWidgets] = useState<{
		active: WidgetItem[]
		inactive: WidgetItem[]
	}>({ active: [], inactive: [] })

	useEffect(() => {
		const allBottomWidgets: WidgetItem[] = [
			{ id: 'calendar', emoji: '📅', label: 'تقویم' },
			{ id: 'weather', emoji: '🌤️', label: 'آب و هوا' },
			{ id: 'todos', emoji: '✅', label: 'وظایف' },
			{ id: 'tools', emoji: '🧰', label: 'ابزارها' },
		]

		setBottomWidgets({
			active: allBottomWidgets.filter(
				(widget) => visibility[widget.id as keyof typeof visibility],
			),
			inactive: allBottomWidgets.filter(
				(widget) => !visibility[widget.id as keyof typeof visibility],
			),
		})
	}, [visibility])

	const toggleWidgetWithDependencies = (
		widgetId: string,
		dependencies: { widgetId: string; condition: boolean }[] = [],
	) => {
		for (const { widgetId: depId, condition } of dependencies) {
			if (condition) {
				toggleWidget(depId as keyof typeof visibility)
			}
		}

		toggleWidget(widgetId as keyof typeof visibility)
	}

	const handleDragEnd = (result: any) => {
		if (!result.destination) return

		const { source, destination } = result
		const newState = { ...bottomWidgets }

		if (source.droppableId === destination.droppableId) {
			const listKey = source.droppableId === 'active-widgets' ? 'active' : 'inactive'
			const list = [...newState[listKey]]
			const [movedItem] = list.splice(source.index, 1)
			list.splice(destination.index, 0, movedItem)
			newState[listKey] = list
		} else {
			const sourceKey = source.droppableId === 'active-widgets' ? 'active' : 'inactive'
			const destKey = destination.droppableId === 'active-widgets' ? 'active' : 'inactive'

			if (destKey === 'active' && newState.active.length >= 4) return

			const sourceList = [...newState[sourceKey]]
			const destList = [...newState[destKey]]
			const [movedItem] = sourceList.splice(source.index, 1)
			destList.splice(destination.index, 0, movedItem)

			newState[sourceKey] = sourceList
			newState[destKey] = destList

			// Update visibility
			toggleWidget(movedItem.id as keyof typeof visibility)
		}

		setBottomWidgets(newState)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="⚙️ تنظیمات ویجت"
			size="md"
			direction="rtl"
		>
			<div className="p-4 space-y-4">
				<p className={`text-sm mb-4 ${getTextColor(theme)}`}>
					انتخاب کنید کدام ویجت‌ها در داشبورد شما نمایش داده شوند.
				</p>

				<div className="space-y-4">
					<div className="p-3 space-y-3 rounded-lg bg-black/5 dark:bg-white/5">
						<h3 className={`text-sm font-bold mb-2 ${getTextColor(theme)}`}>
							ویجت‌های ستون راست
						</h3>

						<CustomCheckbox
							checked={visibility.widgetify}
							onChange={() =>
								toggleWidgetWithDependencies('widgetify', [
									{
										widgetId: 'news',
										condition: !visibility.widgetify && visibility.news,
									},
								])
							}
							label="🏠 نمایش کارت ویجتیفای"
							fontSize="font-light"
						/>

						<div className="relative">
							<CustomCheckbox
								checked={visibility.news}
								onChange={() =>
									toggleWidgetWithDependencies('news', [
										{ widgetId: 'widgetify', condition: visibility.widgetify },
									])
								}
								label="📰 ویجی نیوز"
								disabled={visibility.widgetify}
								fontSize="font-light"
							/>
							{visibility.widgetify && (
								<div className="mt-1 mr-6 text-xs font-light text-amber-500">
									ابتدا کارت ویجتیفای را غیرفعال کنید
								</div>
							)}
						</div>
					</div>

					<div className="p-3 space-y-3 rounded-lg bg-black/5 dark:bg-white/5">
						<h3 className={`text-sm font-bold mb-2 ${getTextColor(theme)}`}>
							ویجت‌های ستون چپ
						</h3>

						<div className="relative">
							<CustomCheckbox
								checked={visibility.comboWidget}
								onChange={() =>
									toggleWidgetWithDependencies('comboWidget', [
										{
											widgetId: 'arzLive',
											condition: !visibility.comboWidget && visibility.arzLive,
										},
									])
								}
								label="🔄 ویجت ترکیبی (ارز و اخبار در یک ویجت)"
								fontSize="font-light"
							/>
						</div>

						<CustomCheckbox
							checked={visibility.arzLive && !visibility.comboWidget}
							onChange={() => {
								if (!visibility.comboWidget) {
									toggleWidget('arzLive')
								}
							}}
							label="💰 ویجی‌ ارز"
							disabled={visibility.comboWidget}
							fontSize="font-light"
						/>
						{visibility.comboWidget && (
							<div className="pr-6 mt-1 text-xs font-light text-blue-500">
								با فعال بودن ویجت ترکیبی، ویجی ارز در همان ویجت قابل دسترسی است
							</div>
						)}
					</div>

					<div className="p-3 space-y-3 rounded-lg bg-black/5 dark:bg-white/5">
						<h3 className={`text-sm font-bold mb-2 ${getTextColor(theme)}`}>
							ویجت‌های پایین صفحه (حداکثر 4 ویجت)
						</h3>

						<DragDropContext onDragEnd={handleDragEnd}>
							<div className="mb-4">
								<p className={`text-xs mb-2 ${getTextColor(theme)} opacity-75`}>
									ویجت‌های فعال ({bottomWidgets.active.length}/4)
								</p>
								<Droppable droppableId="active-widgets" direction="horizontal">
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className="flex flex-wrap gap-2 p-3 border border-gray-300 border-dashed rounded-lg min-h-16 dark:border-gray-700"
										>
											{bottomWidgets.active.map((widget, index) => (
												<Draggable key={widget.id} draggableId={widget.id} index={index}>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={`p-2 rounded-lg cursor-move flex items-center ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-800 hover:bg-gray-700'}`}
														>
															<span className="mr-2">{widget.emoji}</span>
															<span className={`text-sm ${getTextColor(theme)}`}>
																{widget.label}
															</span>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
											{bottomWidgets.active.length === 0 && (
												<div
													className={`w-full text-center p-2 ${getTextColor(theme)} opacity-50 text-sm`}
												>
													برای فعال کردن ویجت‌ها از لیست زیر آنها را به اینجا بکشید
												</div>
											)}
										</div>
									)}
								</Droppable>
							</div>

							<div>
								<p className={`text-xs mb-2 ${getTextColor(theme)} opacity-75`}>
									ویجت‌های غیرفعال
								</p>
								<Droppable droppableId="available-widgets" direction="horizontal">
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className="flex flex-wrap gap-2 p-3 border border-gray-300 border-dashed rounded-lg min-h-16 dark:border-gray-700"
										>
											{bottomWidgets.inactive.map((widget, index) => (
												<Draggable key={widget.id} draggableId={widget.id} index={index}>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={`p-2 rounded-lg cursor-move flex items-center opacity-70 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-800 hover:bg-gray-700'}`}
														>
															<span className="mr-2">{widget.emoji}</span>
															<span className={`text-sm ${getTextColor(theme)}`}>
																{widget.label}
															</span>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
											{bottomWidgets.inactive.length === 0 && (
												<div
													className={`w-full text-center p-2 ${getTextColor(theme)} opacity-50 text-sm`}
												>
													برای غیرفعال کردن ویجت‌ها از بالا به اینجا بکشید
												</div>
											)}
										</div>
									)}
								</Droppable>
							</div>
						</DragDropContext>

						<div className="pt-3 mt-4 border-t border-gray-200 dark:border-gray-700">
							<p className={`text-xs ${getTextColor(theme)} opacity-75 mb-2`}>
								ویجت‌های فعال را می‌توانید با کشیدن و رها کردن جابه‌جا کنید. حداکثر 4 ویجت
								می‌توانید همزمان فعال کنید.
							</p>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}
