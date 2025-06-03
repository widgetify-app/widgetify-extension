import { useWidgetVisibility, widgetItems } from '@/context/widget-visibility.context'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { useState } from 'react'
import { FiMove } from 'react-icons/fi'
import { ItemSelector } from './item-selector'
import Modal from './modal'

interface WidgetSettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

export function WidgetSettingsModal({ isOpen, onClose }: WidgetSettingsModalProps) {
	const { visibility, toggleWidget, reorderWidgets } = useWidgetVisibility()
	const [activeTab, setActiveTab] = useState<'selection' | 'order'>('selection')

	const visibleWidgets = widgetItems.filter((widget) => visibility.includes(widget.id))

	const handleDragEnd = (result: any) => {
		// dropped outside the list
		if (!result.destination) {
			return
		}

		reorderWidgets(result.source.index, result.destination.index)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="⚙️ تنظیمات ویجت"
			size="lg"
			direction="rtl"
		>
			<div className="p-2 space-y-2 overflow-y-auto">
				<div className="flex items-center justify-between mb-4">
					<p className={'text-sm text-content'}>
						{activeTab === 'selection'
							? 'انتخاب کنید کدام ویجت‌ها در نیـو‌تب شما نمایش داده شوند.'
							: 'ویجت‌ها را با کشیدن و رها کردن مرتب کنید.'}
					</p>
					<fieldset className="inline-flex rounded-md shadow-sm">
						<button
							type="button"
							className={`px-4 py-2 text-xs font-medium border ${
								activeTab === 'selection'
									? 'bg-primary/10 border-primary/50 text-primary'
									: 'bg-content border-content text-content'
							} rounded-r-lg`}
							onClick={() => setActiveTab('selection')}
						>
							انتخاب
						</button>
						<button
							type="button"
							className={`px-4 py-2 text-xs font-medium border ${
								activeTab === 'order'
									? 'bg-primary/10 border-primary/50 text-primary'
									: 'bg-content border-content text-content'
							} border-r-0 rounded-l-lg`}
							onClick={() => setActiveTab('order')}
						>
							ترتیب
						</button>
					</fieldset>
				</div>

				{activeTab === 'selection' && (
					<div className="grid grid-cols-2 gap-2">
						{widgetItems.map((widget) => (
							<ItemSelector
								isActive={visibility.includes(widget.id)}
								key={widget.id}
								className="w-full"
								onClick={() => toggleWidget(widget.id)}
								label={`${widget.emoji} ${widget.label}`}
							/>
						))}
					</div>
				)}

				{activeTab === 'order' && (
					<div className="space-y-2">
						{visibleWidgets.length === 0 ? (
							<p className="text-sm text-center py-4 text-muted">
								هیچ ویجتی برای نمایش انتخاب نشده است.
							</p>
						) : (
							<DragDropContext onDragEnd={handleDragEnd}>
								<Droppable droppableId="widget-list">
									{(provided) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className="space-y-2"
										>
											{visibility.map((widgetId, index) => {
												const widget = widgetItems.find((item) => item.id === widgetId)
												if (!widget) return null

												return (
													<Draggable
														key={widget.id}
														draggableId={widget.id}
														index={index}
													>
														{(provided, snapshot) => (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
																	snapshot.isDragging
																		? 'bg-primary/20 border-primary/50'
																		: 'bg-content border-content'
																}`}
															>
																<div className="flex items-center gap-2">
																	<span className="text-lg">{widget.emoji}</span>
																	<span>{widget.label}</span>
																</div>
																<div
																	{...provided.dragHandleProps}
																	className="p-1 cursor-move hover:bg-content rounded-lg"
																	title="جابجا کردن"
																>
																	<FiMove className="text-muted" />
																</div>
															</div>
														)}
													</Draggable>
												)
											})}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						)}
					</div>
				)}
			</div>
		</Modal>
	)
}
