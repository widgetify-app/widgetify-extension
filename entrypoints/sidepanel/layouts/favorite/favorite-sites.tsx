import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Analytics from '@/analytics'
import Tooltip from '@/components/toolTip'
import { useFavoriteStore } from '../../context/favorite.context'
import type { FavoriteSite } from './favorite.types'

interface SortableItemProps {
	item: FavoriteSite
	onClick: (item: FavoriteSite) => void
}

function SortableItem({ item, onClick }: SortableItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id: item.url })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="flex items-center justify-center w-full h-12 p-2 transition-all rounded-lg cursor-grab active:cursor-grabbing bg-base-300 hover:bg-base-200 aspect-square"
			onClick={() => onClick(item)}
		>
			<Tooltip content={item.title}>
				<img
					src={item.favicon}
					alt={item.title}
					className="object-cover rounded-md pointer-events-none max-w-8 max-h-8"
				/>
			</Tooltip>
		</div>
	)
}

export function FavoriteSites() {
	const { favorites, reorderFavorites } = useFavoriteStore()

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const onClick = (item: FavoriteSite) => {
		Analytics.event('vertical_tabs_favorite_site_clicked')
		browser.tabs.create({ url: item.url })
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (over && active.id !== over.id) {
			const oldIndex = favorites.findIndex((item) => item.url === active.id)
			const newIndex = favorites.findIndex((item) => item.url === over.id)

			const newFavorites = arrayMove(favorites, oldIndex, newIndex)
			reorderFavorites(newFavorites)

			Analytics.event('vertical_tabs_favorite_site_reordered')
		}
	}

	const sortedFavorites = [...favorites].sort((a, b) => {
		const orderA = a.order ?? 0
		const orderB = b.order ?? 0
		return orderA - orderB
	})

	return (
		<div className="p-4">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={sortedFavorites.map((f) => f.url)}
					strategy={rectSortingStrategy}
				>
					<div className="grid grid-cols-5 gap-4 justify-items-center">
						{sortedFavorites.length > 0
							? sortedFavorites.map((item) => (
									<SortableItem
										key={item.url}
										item={item}
										onClick={onClick}
									/>
								))
							: new Array(3).fill(0).map((_, index) => (
									<div
										key={`fav-placeholder-${index}`}
										className="flex items-center justify-center w-full h-12 p-2 transition-all rounded-lg cursor-not-allowed bg-base-300 hover:bg-base-200 aspect-square"
									>
										<div className="w-full h-full rounded-md animate-pulse" />
									</div>
								))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	)
}
