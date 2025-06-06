import { useAuth } from '@/context/auth.context'
import {
	MAX_VISIBLE_WIDGETS,
	useWidgetVisibility,
	widgetItems,
} from '@/context/widget-visibility.context'
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
	const { visibility, toggleWidget, reorderWidgets, getSortedWidgets } =
		useWidgetVisibility()
	const { isAuthenticated } = useAuth()
	const [activeTab, setActiveTab] = useState<'selection' | 'order'>('selection')

	const sortedVisibleWidgets = getSortedWidgets()

	const handleDragEnd = (result: any) => {
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
							className={`px-4 cursor-pointer py-2 text-xs font-medium border ${
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
							className={`px-4 cursor-pointer py-2 text-xs font-medium border ${
								activeTab === 'order'
									? 'bg-primary/10 border-primary/50 text-primary'
									: 'bg-content border-content text-content'
							} border-r-0 rounded-l-lg`}
							onClick={() => setActiveTab('order')}
						>
							ترتیب
						</button>{' '}
					</fieldset>
				</div>{' '}
				{!isAuthenticated && activeTab === 'selection' && (
					<div className="p-3 mb-4 border rounded-lg border-warning bg-warning/10">
						<p className="text-sm text-warning-content">
							⚠️ کاربران مهمان تنها می‌توانند حداکثر {MAX_VISIBLE_WIDGETS}{' '}
							ویجت فعال کنند. برای فعال کردن ویجت‌های بیشتر، وارد حساب کاربری
							خود شوید.
						</p>
					</div>
				)}{' '}
				{activeTab === 'selection' && (
					<div className="grid grid-cols-2 gap-2">
						{widgetItems.map((widget) => {
							const isActive = visibility.includes(widget.id)
							const canToggle =
								isAuthenticated ||
								isActive ||
								visibility.length < MAX_VISIBLE_WIDGETS

							return (
								<ItemSelector
									isActive={isActive}
									key={widget.id}
									className={`w-full ${!canToggle ? 'opacity-50 cursor-not-allowed' : ''}`}
									onClick={() => canToggle && toggleWidget(widget.id)}
									label={`${widget.emoji} ${widget.label}`}
								/>
							)
						})}
					</div>
				)}{' '}
				{activeTab === 'order' && (
					<div className="space-y-2">
						{sortedVisibleWidgets.length === 0 ? (
							<p className="py-4 text-sm text-center text-muted">
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
											{sortedVisibleWidgets.map((widget, index) => (
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
																<span className="text-lg">
																	{widget.emoji}
																</span>
																<span>
																	{widget.label}
																</span>
															</div>
															<div
																{...provided.dragHandleProps}
																className="p-1 rounded-lg cursor-move hover:bg-content"
																title="جابجا کردن"
															>
																<FiMove className="text-muted" />
															</div>
														</div>
													)}
												</Draggable>
											))}
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
