import type React from 'react'
import { useCallback, useRef, useState } from 'react'
import { callEvent } from '@/common/utils/call-event'
import { useFreeWidgets } from '@/context/free-widget.context'
import { getWidgetPixelRect } from '../grid-geometry'
import type {
	StoredWidget,
	WidgetDefinition,
	WidgetPosition,
	WidgetSize,
} from '../layout-engine/types'
import { WidgetContextMenu } from './widget-context-menu'

interface CanvasWidgetOuterProps {
	widget: StoredWidget
	definition: WidgetDefinition
	cellWidth: number
	cellHeight: number
	gap: number
	cols: number
}

export function CanvasWidgetOuter({
	widget,
	definition,
	cellWidth,
	cellHeight,
	gap,
	cols,
}: CanvasWidgetOuterProps) {
	const {
		canvasMode,
		setCanvasMode,
		selectedInstanceId,
		setSelectedInstanceId,
		resizeWidget,
		moveWidget,
		duplicateWidget,
		removeWidget,
	} = useFreeWidgets()

	const [isDragging, setIsDragging] = useState(false)
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
	const [contextMenuPos, setContextMenuPos] = useState<{
		x: number
		y: number
	} | null>(null)

	const isSelected = canvasMode === 'edit' && selectedInstanceId === widget.instanceId
	const isWiggling = canvasMode === 'edit' && selectedInstanceId !== widget.instanceId

	const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
	const dragStartPosRef = useRef<WidgetPosition>(widget.position)
	const isDragActiveRef = useRef(false)

	const pixelRect = getWidgetPixelRect(
		widget.position,
		widget.size,
		cellWidth,
		cellHeight,
		gap
	)

	const clearLongPress = useCallback(() => {
		if (longPressTimerRef.current) {
			clearTimeout(longPressTimerRef.current)
			longPressTimerRef.current = null
		}
	}, [])

	const handlePointerDown = (e: React.PointerEvent) => {
		if (e.button !== 0) return

		const target = e.target as HTMLElement
		if (
			target.closest('button') ||
			target.closest('input') ||
			target.closest('textarea') ||
			target.closest('a') ||
			target.closest('.no-drag')
		) {
			return
		}

		clearLongPress()
		pointerStartRef.current = { x: e.clientX, y: e.clientY }
		dragStartPosRef.current = { ...widget.position }
		isDragActiveRef.current = false

		if (canvasMode === 'normal') {
			longPressTimerRef.current = setTimeout(() => {
				setCanvasMode('edit')
				setSelectedInstanceId(widget.instanceId)
				clearLongPress()
			}, 450)
		}

		;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
	}

	const handlePointerMove = (e: React.PointerEvent) => {
		if (!pointerStartRef.current) return

		const dx = e.clientX - pointerStartRef.current.x
		const dy = e.clientY - pointerStartRef.current.y
		const dist = Math.sqrt(dx * dx + dy * dy)

		if (dist > 8 && longPressTimerRef.current) {
			clearLongPress()
		}

		const dragThreshold = canvasMode === 'edit' ? 6 : 14

		if (dist > dragThreshold && (canvasMode === 'edit' || isDragActiveRef.current)) {
			if (!isDragActiveRef.current) {
				isDragActiveRef.current = true
				setIsDragging(true)
			}
			setDragOffset({ x: dx, y: dy })
		}
	}

	const handlePointerUp = (e: React.PointerEvent) => {
		clearLongPress()

		if (isDragActiveRef.current) {
			const unitW = cellWidth + gap
			const unitH = cellHeight + gap

			const deltaCol = unitW > 0 ? Math.round(dragOffset.x / unitW) : 0
			const deltaRow = unitH > 0 ? Math.round(dragOffset.y / unitH) : 0

			const targetCol = Math.max(
				0,
				Math.min(cols - widget.size.w, dragStartPosRef.current.col + deltaCol)
			)
			const targetRow = Math.max(0, dragStartPosRef.current.row + deltaRow)

			if (
				targetCol !== widget.position.col ||
				targetRow !== widget.position.row
			) {
				moveWidget(widget.instanceId, { col: targetCol, row: targetRow })
			}
		}

		pointerStartRef.current = null
		isDragActiveRef.current = false
		setIsDragging(false)
		setDragOffset({ x: 0, y: 0 })

		try {
			;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
		} catch {}
	}

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setContextMenuPos({ x: e.clientX, y: e.clientY })
	}

	const handleResize = (newSize: WidgetSize) => {
		resizeWidget(widget.instanceId, newSize)
	}

	const handleDuplicate = () => {
		duplicateWidget(widget.instanceId)
	}

	const handleSettings = () => {
		if (definition.settingsTab) {
			callEvent('openWidgetsSettings', { tab: definition.settingsTab })
		}
	}

	const handleDelete = () => {
		removeWidget(widget.instanceId)
	}

	const currentLeft = isDragging ? pixelRect.left + dragOffset.x : pixelRect.left
	const currentTop = isDragging ? pixelRect.top + dragOffset.y : pixelRect.top

	return (
		<>
			<div
				className={`widget-outer absolute select-none ${
					isDragging
						? 'z-50 shadow-2xl cursor-grabbing scale-[1.03]'
						: 'z-10 cursor-default'
				} ${!isDragging ? 'widget-canvas-item-transition' : ''} ${
					isWiggling ? 'animate-widget-wiggle' : ''
				} ${
					isSelected
						? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100 rounded-2xl'
						: ''
				}`}
				style={{
					left: `${currentLeft}px`,
					top: `${currentTop}px`,
					width: `${pixelRect.width}px`,
					height: `${pixelRect.height}px`,
					touchAction: 'none',
				}}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
				onContextMenu={handleContextMenu}
				onClickCapture={(e) => {
					if (canvasMode === 'edit') {
						const target = e.target as HTMLElement
						if (
							target.closest('button[title="حذف ویجت"]') ||
							target.closest('.widget-size-toolbar')
						) {
							return
						}
						e.preventDefault()
						e.stopPropagation()
					}
				}}
			>
				{canvasMode === 'edit' && (
					<button
						type="button"
						onPointerDown={(e) => e.stopPropagation()}
						onPointerUp={(e) => e.stopPropagation()}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							handleDelete()
						}}
						className="absolute -top-2 -right-2 z-50 w-6 h-6 rounded-full bg-error text-white text-xs font-bold flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 cursor-pointer transition-transform"
						title="حذف ویجت"
					>
						✕
					</button>
				)}

				<div
					className={`w-full h-full relative ${
						canvasMode === 'edit' ? 'pointer-events-none select-none' : ''
					}`}
				>
					{definition.node(widget.instanceId, widget.size)}
					{canvasMode === 'edit' && (
						<div className="absolute inset-0 z-30 bg-transparent pointer-events-auto cursor-grab" />
					)}
				</div>
			</div>

			{contextMenuPos && (
				<WidgetContextMenu
					x={contextMenuPos.x}
					y={contextMenuPos.y}
					widget={widget}
					definition={definition}
					cols={cols}
					onClose={() => setContextMenuPos(null)}
					onResize={handleResize}
					onDuplicate={handleDuplicate}
					onSettings={definition.settingsTab ? handleSettings : undefined}
					onDelete={handleDelete}
				/>
			)}
		</>
	)
}
