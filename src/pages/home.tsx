import { DragDropContext, Draggable, type DropResult, Droppable } from '@hello-pangea/dnd'
import { RxDragHandleDots2 } from 'react-icons/rx'

import { useStore } from '../context/store.context'
import { ArzLiveLayout } from '../layouts/arzLive/arzLive.layout'
import { SearchLayout } from '../layouts/search/search'

export function HomePage() {
	const { layouts, setLayouts } = useStore()

	const onDragEnd = (result: DropResult) => {
		const { destination, source } = result
		if (!destination) return

		const items = Array.from(layouts)
		const [reorderedItem] = items.splice(source.index, 1)
		items.splice(destination.index, 0, reorderedItem)

		setLayouts(items)
	}

	return (
		<div className="flex flex-col bg-transparent">
			{/* Search Section - Fixed at top */}
			<div className="w-full ">
				<SearchLayout />
			</div>

			{/* Main Content */}
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="layouts">
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="flex justify-center gap-1"
						>
							{layouts.map((layout, index) => (
								<Draggable key={layout.id} draggableId={layout.id} index={index}>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											className={`h-fit grid gap-2
                          ${layout.id === 'arz-live' ? ' ' : ''}
                          ${layout.id === 'weather' ? '' : ''}
                          ${layout.id === 'calendar' ? '' : ''}
                        `}
										>
											{layout.moveable && (
												<div
													{...provided.dragHandleProps}
													className="flex items-center transition-colors duration-200 rounded-t-xl hover:bg-neutral-800/50"
												>
													<RxDragHandleDots2 className="text-gray-400" size={20} />
												</div>
											)}
											<div>{layout.component}</div>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<ArzLiveLayout />
		</div>
	)
}

//     backdrop-blur-md bg-neutral-900/70 rounded-xl
