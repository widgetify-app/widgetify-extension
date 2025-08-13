import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { FiMove } from 'react-icons/fi'
import { useAuth } from '@/context/auth.context'
import {
	MAX_VISIBLE_WIDGETS,
	useWidgetVisibility,
	widgetItems,
} from '@/context/widget-visibility.context'
import { ItemSelector } from './item-selector'
import Modal from './modal'

interface WidgetSettingsModalProps {
	isOpen: boolean
	onClose: () => void
}
// Sortable widget component that uses dnd-kit
function SortableWidget({ widget }: { widget: any }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id: widget.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
				isDragging
					? 'bg-primary/20 border-primary/50'
					: 'bg-content border-content'
			}`}
		>
			<div className="flex items-center gap-2">
				<span className="text-lg">{widget.emoji}</span>
				<span>{widget.label}</span>
			</div>
			<div
				{...attributes}
				{...listeners}
				className="p-1 rounded-lg cursor-move hover:bg-content"
				title="جابجا کردن"
			>
				<FiMove className="text-muted" />
			</div>
		</div>
	)
}

export function WidgetSettingsModal({ isOpen, onClose }: WidgetSettingsModalProps) {
	const { visibility, toggleWidget, reorderWidgets, getSortedWidgets } =
		useWidgetVisibility()
	const { isAuthenticated } = useAuth()
	const [activeTab, setActiveTab] = useState<'selection' | 'order'>('selection')

	const sortedVisibleWidgets = getSortedWidgets()

	// Set up sensors for keyboard and pointer interactions
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5, // 5px movement required before drag starts
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const handleDragEnd = (event: any) => {
		const { active, over } = event

		if (!over || active.id === over.id) {
			return
		}

		const oldIndex = sortedVisibleWidgets.findIndex((item) => item.id === active.id)
		const newIndex = sortedVisibleWidgets.findIndex((item) => item.id === over.id)

		reorderWidgets(oldIndex, newIndex)
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
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={sortedVisibleWidgets.map(
										(widget) => widget.id
									)}
									strategy={verticalListSortingStrategy}
								>
									<div className="space-y-2">
										{sortedVisibleWidgets.map((widget) => (
											<SortableWidget
												key={widget.id}
												widget={widget}
											/>
										))}
									</div>
								</SortableContext>
							</DndContext>
						)}
					</div>
				)}
			</div>
		</Modal>
	)
}
