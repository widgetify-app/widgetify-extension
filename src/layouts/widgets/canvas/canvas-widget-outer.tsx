import type React from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { useFreeWidgetActions } from '@/context/free-widget.context'
import { getWidgetPixelRect } from '../grid-geometry'
import {
	type StoredWidget,
	type WidgetDefinition,
	WidgetKeys,
	type WidgetPosition,
	type WidgetSize,
} from '../layout-engine/types'
import { cn } from '@/common/utils/cn'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/src/icons'
import { useWidgetVipResolver } from '@/services/hooks/widgets/widget-catalog.hook'
import { WidgetContextMenu } from './widget-context-menu'
import { BookmarkDeleteModal } from './bookmark-delete-modal'
import { WidgetSlot } from './widget-slot'

interface CanvasWidgetOuterProps {
	widget: StoredWidget
	definition: WidgetDefinition
	cellWidth: number
	cellHeight: number
	gap: number
	cols: number
	canvasMode: 'normal' | 'edit'
	isSelected: boolean
	wiggleVariant: number
}

const WIGGLE_CLASSES = [
	'animate-widget-wiggle-a',
	'animate-widget-wiggle-b',
	'animate-widget-wiggle-c',
]

function CanvasWidgetOuterImpl({
	widget,
	definition,
	cellWidth,
	cellHeight,
	gap,
	cols,
	canvasMode,
	isSelected,
	wiggleVariant,
}: CanvasWidgetOuterProps) {
	const { isVip } = useAuth()
	const { isWidgetVipOnly, isVariantVipOnly, isSizeVipOnly } = useWidgetVipResolver()
	const {
		setCanvasMode,
		setSelectedInstanceId,
		getGridBounds,
		resizeWidget,
		startDragPreview,
		updateDragPreview,
		endDragPreview,
		duplicateWidget,
		removeWidget,
	} = useFreeWidgetActions()

	const isCurrentWidgetVipOnly = isWidgetVipOnly(widget.id)
	const isCurrentVariantVipOnly = isVariantVipOnly(widget.id, widget.meta?.variant)
	const isCurrentSizeVipOnly = isSizeVipOnly(widget.id, widget.size)
	const isLocked =
		!isVip &&
		(isCurrentWidgetVipOnly || isCurrentVariantVipOnly || isCurrentSizeVipOnly)
	const isCompactSize = widget.size.w === 1 && widget.size.h === 1

	const [isDragging, setIsDragging] = useState(false)
	const [contextMenuPos, setContextMenuPos] = useState<{
		x: number
		y: number
	} | null>(null)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const isWiggling = canvasMode === 'edit' && !isSelected

	const outerRef = useRef<HTMLDivElement>(null)
	const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
	const dragStartPosRef = useRef<WidgetPosition>(widget.position)
	const dragBaseRectRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 })
	const isDragActiveRef = useRef(false)
	const activePointerIdRef = useRef<number | null>(null)
	const rafRef = useRef<number | null>(null)
	const pendingOffsetRef = useRef<{ x: number; y: number } | null>(null)
	const previewPosRef = useRef<WidgetPosition | null>(null)

	const anchorPosition = isDragging ? dragStartPosRef.current : widget.position
	const pixelRect = getWidgetPixelRect(
		anchorPosition,
		widget.size,
		cellWidth,
		cellHeight,
		gap
	)

	const baseTransform = `translate3d(${pixelRect.left}px, ${pixelRect.top}px, 0)`
	const baseTransformRef = useRef(baseTransform)
	baseTransformRef.current = baseTransform

	const resetDragState = useCallback(() => {
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current)
			rafRef.current = null
		}
		if (outerRef.current) {
			outerRef.current.style.transform = baseTransformRef.current
		}
		pointerStartRef.current = null
		isDragActiveRef.current = false
		activePointerIdRef.current = null
		pendingOffsetRef.current = null
		previewPosRef.current = null
		setIsDragging(false)
	}, [])

	const finishDrag = useCallback(
		(targetPosition: WidgetPosition | null) => {
			try {
				if (isDragActiveRef.current) {
					endDragPreview(widget.instanceId, targetPosition)
				}
			} finally {
				resetDragState()
			}
		},
		[endDragPreview, widget.instanceId, resetDragState]
	)

	useEffect(() => {
		const removeListener = listenEvent('cancelWidgetDrag', () => {
			finishDrag(null)
		})
		return () => removeListener()
	}, [finishDrag])

	useEffect(() => {
		if (!isDragging) return

		const settle = (e: PointerEvent) => {
			if (e.pointerId !== activePointerIdRef.current) return
			finishDrag(null)
		}

		window.addEventListener('pointerup', settle)
		window.addEventListener('pointercancel', settle)
		return () => {
			window.removeEventListener('pointerup', settle)
			window.removeEventListener('pointercancel', settle)
		}
	}, [isDragging, finishDrag])

	const handlePointerDown = (e: React.PointerEvent) => {
		if (e.button !== 0 || canvasMode !== 'edit') return
		if (isDragActiveRef.current) return

		const target = e.target as HTMLElement
		if (
			target.closest('button') ||
			target.closest('input') ||
			target.closest('textarea') ||
			target.closest('select') ||
			target.closest('a') ||
			target.closest('[role="button"]') ||
			target.closest('.cursor-pointer') ||
			target.closest('.no-drag')
		) {
			return
		}

		pointerStartRef.current = { x: e.clientX, y: e.clientY }
		dragStartPosRef.current = { ...widget.position }
		dragBaseRectRef.current = { left: pixelRect.left, top: pixelRect.top }
		isDragActiveRef.current = false
		activePointerIdRef.current = e.pointerId
		setSelectedInstanceId(widget.instanceId)
	}

	const getTargetPosition = (offset: { x: number; y: number }): WidgetPosition => {
		const unitW = cellWidth + gap
		const unitH = cellHeight + gap

		const deltaCol = unitW > 0 ? Math.round(offset.x / unitW) : 0
		const deltaRow = unitH > 0 ? Math.round(offset.y / unitH) : 0

		const { maxRows } = getGridBounds()
		const rowLimit = Math.max(0, maxRows - widget.size.h)

		return {
			col: Math.max(
				0,
				Math.min(cols - widget.size.w, dragStartPosRef.current.col + deltaCol)
			),
			row: Math.max(0, Math.min(rowLimit, dragStartPosRef.current.row + deltaRow)),
		}
	}

	const handlePointerMove = (e: React.PointerEvent) => {
		if (canvasMode !== 'edit' || !pointerStartRef.current) return
		if (e.pointerId !== activePointerIdRef.current) return

		const dx = e.clientX - pointerStartRef.current.x
		const dy = e.clientY - pointerStartRef.current.y
		const dist = Math.sqrt(dx * dx + dy * dy)

		const dragThreshold = 6

		if (dist > dragThreshold) {
			if (!isDragActiveRef.current) {
				isDragActiveRef.current = true
				previewPosRef.current = { ...dragStartPosRef.current }
				startDragPreview()
				setIsDragging(true)
				try {
					;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
				} catch {}
			}
			pendingOffsetRef.current = { x: dx, y: dy }
			if (rafRef.current === null) {
				rafRef.current = requestAnimationFrame(() => {
					rafRef.current = null
					const offset = pendingOffsetRef.current
					if (!offset) return

					const base = dragBaseRectRef.current
					if (outerRef.current) {
						outerRef.current.style.transform = `translate3d(${base.left + offset.x}px, ${base.top + offset.y}px, 0)`
					}

					const target = getTargetPosition(offset)
					const previous = previewPosRef.current
					if (
						!previous ||
						target.col !== previous.col ||
						target.row !== previous.row
					) {
						previewPosRef.current = target
						updateDragPreview(widget.instanceId, target)
					}
				})
			}
		}
	}

	const handlePointerUp = (e: React.PointerEvent) => {
		if (e.pointerId !== activePointerIdRef.current) return

		const dropTarget = isDragActiveRef.current
			? getTargetPosition(pendingOffsetRef.current ?? { x: 0, y: 0 })
			: null

		try {
			;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
		} catch {}

		finishDrag(dropTarget)
	}

	const handlePointerCancel = (e: React.PointerEvent) => {
		if (e.pointerId !== activePointerIdRef.current) return
		finishDrag(null)
	}

	const handleLostPointerCapture = (e: React.PointerEvent) => {
		if (e.pointerId !== activePointerIdRef.current) return
		finishDrag(null)
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
			callEvent('openWidgetsSettings', {
				tab: definition.settingsTab,
				instanceId: widget.instanceId,
				size: widget.size,
			})
		}
	}

	const handleEditVariant = () => {
		callEvent('openAddCustomWidgetModal', {
			instanceId: widget.instanceId,
			widgetId: widget.id,
		})
	}

	const handleMove = () => {
		setCanvasMode(canvasMode === 'edit' ? 'normal' : 'edit')
	}

	const handleDelete = () => {
		if (widget.id === WidgetKeys.bookmarks) {
			setShowDeleteConfirm(true)
			return
		}
		removeWidget(widget.instanceId)
	}

	return (
		<>
			<div
				ref={outerRef}
				className={cn(
					'widget-outer absolute top-0 left-0 select-none',
					isDragging
						? 'z-50 shadow-2xl cursor-grabbing'
						: 'z-10 cursor-default',
					!isDragging && 'widget-canvas-item-transition'
				)}
				style={{
					width: `${pixelRect.width}px`,
					height: `${pixelRect.height}px`,
					touchAction: 'none',
					transform: baseTransform,
					scale: isDragging ? '1.03' : undefined,
					willChange: isDragging ? 'transform' : undefined,
				}}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerCancel}
				onLostPointerCapture={handleLostPointerCapture}
				onContextMenu={handleContextMenu}
				onClickCapture={(e) => {
					if (canvasMode === 'edit') {
						const target = e.target as HTMLElement
						if (
							target.closest('.widget-delete-btn') ||
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
						title="حذف ویجت"
						onPointerDown={(e) => e.stopPropagation()}
						onPointerUp={(e) => e.stopPropagation()}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							handleDelete()
						}}
						className="widget-delete-btn absolute z-50 flex items-center justify-center w-6 h-6 text-xs font-bold text-white transition-transform rounded-full shadow-lg cursor-pointer -top-2 -right-2 bg-error hover:scale-110 active:scale-95"
					>
						✕
					</button>
				)}

				<div
					className={cn(
						'w-full h-full relative',
						canvasMode === 'edit' && 'pointer-events-none select-none',
						isWiggling && WIGGLE_CLASSES[wiggleVariant]
					)}
				>
					<WidgetSlot
						definition={definition}
						instanceId={widget.instanceId}
						size={widget.size}
						meta={widget.meta}
					/>
					{isLocked && canvasMode === 'normal' && (
						<div
							className="absolute inset-0 z-25 rounded-widget bg-content bg-glass border border-indigo-500/25 flex flex-col items-center justify-center p-1.5 text-center select-none cursor-default overflow-hidden"
							style={{
								zIndex: 1000,
							}}
							onClick={(e) => e.stopPropagation()}
						>
							<div
								className={cn(
									'rounded-full bg-indigo-500/15 text-indigo-500 flex items-center justify-center shadow-2xs',
									isCompactSize ? 'w-6 h-6 mb-1' : 'w-8 h-8 mb-1.5'
								)}
							>
								<Icon name="crown" size={isCompactSize ? 12 : 15} />
							</div>
							<span
								className={cn(
									'font-bold text-content leading-tight',
									isCompactSize ? 'text-[10px]' : 'text-xs'
								)}
							>
								{isCompactSize ? 'مخصوص پرو' : 'مخصوص کاربران پرو'}
							</span>
						</div>
					)}
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
					onMove={handleMove}
					onSettings={definition.settingsTab ? handleSettings : undefined}
					onEditVariant={
						definition.variants?.length ? handleEditVariant : undefined
					}
					onDelete={handleDelete}
				/>
			)}

			<BookmarkDeleteModal
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={() => {
					setShowDeleteConfirm(false)
					removeWidget(widget.instanceId)
				}}
			/>
		</>
	)
}

export const CanvasWidgetOuter = memo(
	CanvasWidgetOuterImpl,
	(a, b) =>
		a.widget === b.widget &&
		a.definition === b.definition &&
		a.cellWidth === b.cellWidth &&
		a.cellHeight === b.cellHeight &&
		a.gap === b.gap &&
		a.cols === b.cols &&
		a.canvasMode === b.canvasMode &&
		a.isSelected === b.isSelected &&
		a.wiggleVariant === b.wiggleVariant
)
