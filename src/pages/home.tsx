import { DragDropContext, Draggable, type DropResult, Droppable } from '@hello-pangea/dnd'
import { useEffect, useState } from 'react'
import { RxDragHandleDots2 } from 'react-icons/rx'

import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'
import { type SelectedCity, storeContext } from '../context/setting.context'
import { ArzLiveLayout } from '../layouts/arzLive/arzLive.layout'
import CalendarLayout from '../layouts/calendar/calendar'
import { SearchLayout } from '../layouts/search/search'
import { WeatherLayout } from '../layouts/weather/weather.layout'

type LayoutItem = {
	id: string
	component: React.ReactNode
	moveable: boolean
}

export function HomePage() {
	const defaultCurrencies = ['USD', 'EUR', 'GRAM']
	const storedCurrencies = getFromStorage(StoreKey.CURRENCIES) as string[] | null
	const [selectedCurrencies, setSelectedCurrencies] = useState<Array<string>>(
		storedCurrencies && storedCurrencies.length > 0
			? storedCurrencies
			: defaultCurrencies,
	)

	const city = getFromStorage<SelectedCity>(StoreKey.SELECTED_CITY)
	const [selectedCity, setSelectedCity] = useState<SelectedCity>(
		city || {
			city: 'Tehran',
			lat: 35.6892523,
			lon: 51.3896004,
		},
	)

	const initialLayouts: LayoutItem[] = [
		// {
		// 	id: 'arz-live',
		// 	component: <ArzLiveLayout />,
		// 	moveable: true,
		// },
		{
			id: 'weather',
			component: <WeatherLayout />,
			moveable: true,
		},
		{
			id: 'calendar',
			component: <CalendarLayout />,
			moveable: true,
		},
	]

	const storedOrder = getFromStorage<string[]>(StoreKey.LAYOUT_ORDER)
	const [layouts, setLayouts] = useState<LayoutItem[]>(() => {
		if (storedOrder) {
			return storedOrder
				.map((id) => initialLayouts.find((layout) => layout.id === id))
				.filter((layout): layout is LayoutItem => layout !== undefined)
		}
		return initialLayouts
	})

	const onDragEnd = (result: DropResult) => {
		const { destination, source } = result
		if (!destination) return

		const items = Array.from(layouts)
		const [reorderedItem] = items.splice(source.index, 1)
		items.splice(destination.index, 0, reorderedItem)

		setLayouts(items)
		setToStorage(
			StoreKey.LAYOUT_ORDER,
			items.map((item) => item.id),
		)
	}

	useEffect(() => {
		setToStorage(StoreKey.CURRENCIES, selectedCurrencies)
	}, [selectedCurrencies])

	return (
		<storeContext.Provider
			value={{
				selectedCurrencies,
				setSelectedCurrencies,
				selectedCity,
				setSelectedCity,
			}}
		>
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
												<div className="">{layout.component}</div>
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
		</storeContext.Provider>
	)
}

//     backdrop-blur-md bg-neutral-900/70 rounded-xl
