import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { useFreeWidgets } from '@/context/free-widget.context'
import { getWidgetPixelRect, WIDGET_VERTICAL_INSET } from '../grid-geometry'
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
	const { isVip } = useAuth()
	const { isWidgetVipOnly, isVariantVipOnly, isSizeVipOnly } = useWidgetVipResolver()
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

	const isCurrentWidgetVipOnly = isWidgetVipOnly(widget.id)
	const isCurrentVariantVipOnly = isVariantVipOnly(widget.id, widget.meta?.variant)
	const isCurrentSizeVipOnly = isSizeVipOnly(widget.id, widget.size)
	const isLocked =
		!isVip &&
		(isCurrentWidgetVipOnly || isCurrentVariantVipOnly || isCurrentSizeVipOnly)
	const isCompactSize = widget.size.w === 1 && widget.size.h === 1

	const [isDragging, setIsDragging] = useState(false)
	const [isSettling, setIsSettling] = useState(false)
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
	const [contextMenuPos, setContextMenuPos] = useState<{
		x: number
		y: number
	} | null>(null)

	const isSelected = canvasMode === 'edit' && selectedInstanceId === widget.instanceId
	const isWiggling = canvasMode === 'edit' && selectedInstanceId !== widget.instanceId

	const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
	const dragStartPosRef = useRef<WidgetPosition>(widget.position)
	const isDragActiveRef = useRef(false)
	const activePointerIdRef = useRef<number | null>(null)
	const rafRef = useRef<number | null>(null)
	const pendingOffsetRef = useRef<{ x: number; y: number } | null>(null)

	const pixelRect = getWidgetPixelRect(
		widget.position,
		widget.size,
		cellWidth,
		cellHeight,
		gap
	)

	const resetDragState = useCallback(() => {
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current)
			rafRef.current = null
		}
		pointerStartRef.current = null
		isDragActiveRef.current = false
		activePointerIdRef.current = null
		pendingOffsetRef.current = null
		setIsDragging(false)
		setDragOffset({ x: 0, y: 0 })
	}, [])

	useEffect(() => {
		const removeListener = listenEvent('cancelWidgetDrag', () => {
			resetDragState()
		})
		return () => removeListener()
	}, [resetDragState])

	/**
	 * While dragging, the live offset is applied via `transform` on top of the
	 * committed `left/top`. On drop those two change in the same commit: the
	 * transform disappears and `left/top` jump to the newly committed cell. With
	 * the position transition still enabled the browser would animate `left/top`
	 * from the ORIGINAL cell to the new one while the transform vanishes
	 * instantly — the widget visibly snaps back to where the drag started and
	 * then slides to the destination. Suppressing the transition for that one
	 * frame lets it land exactly where it was dropped.
	 */
	useEffect(() => {
		if (!isSettling) return

		const frame = requestAnimationFrame(() => setIsSettling(false))
		return () => cancelAnimationFrame(frame)
	}, [isSettling])

	const handlePointerDown = (e: React.PointerEvent) => {
		if (e.button !== 0 || canvasMode !== 'edit') return
		if (pointerStartRef.current !== null) return

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
		isDragActiveRef.current = false
		activePointerIdRef.current = e.pointerId
		setSelectedInstanceId(widget.instanceId)
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
				setIsDragging(true)
				try {
					;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
				} catch {}
			}
			pendingOffsetRef.current = { x: dx, y: dy }
			if (rafRef.current === null) {
				rafRef.current = requestAnimationFrame(() => {
					rafRef.current = null
					if (pendingOffsetRef.current) {
						setDragOffset(pendingOffsetRef.current)
					}
				})
			}
		}
	}

	const handlePointerUp = (e: React.PointerEvent) => {
		if (e.pointerId !== activePointerIdRef.current) return

		if (isDragActiveRef.current) {
			setIsSettling(true)
			const finalOffset = pendingOffsetRef.current ?? dragOffset
			const unitW = cellWidth + gap
			const unitH = cellHeight + gap

			const deltaCol = unitW > 0 ? Math.round(finalOffset.x / unitW) : 0
			const deltaRow = unitH > 0 ? Math.round(finalOffset.y / unitH) : 0

			const targetCol = Math.max(
				0,
				Math.min(cols - widget.size.w, dragStartPosRef.current.col + deltaCol)
			)
			const targetRow = Math.max(0, dragStartPosRef.current.row + deltaRow)

			if (targetCol !== widget.position.col || targetRow !== widget.position.row) {
				moveWidget(widget.instanceId, { col: targetCol, row: targetRow })
			}
		}

		try {
			;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
		} catch {}

		resetDragState()
	}

	const handlePointerCancel = (e: React.PointerEvent) => {
		if (e.pointerId !== activePointerIdRef.current) return
		resetDragState()
	}

	const handleLostPointerCapture = (e: React.PointerEvent) => {
		if (e.pointerId !== activePointerIdRef.current) return
		resetDragState()
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

	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
				className={cn(
					'widget-outer absolute select-none',
					isDragging
						? 'z-50 shadow-2xl cursor-grabbing scale-[1.03]'
						: 'z-10 cursor-default',
					!isDragging && !isSettling && 'widget-canvas-item-transition',
					isWiggling && 'animate-widget-wiggle',
					isSelected && 'ring-2 ring-primary rounded-widget'
				)}
				style={{
					left: `${pixelRect.left}px`,
					top: `${pixelRect.top}px`,
					width: `${pixelRect.width}px`,
					height: `${pixelRect.height - WIDGET_VERTICAL_INSET}px`,
					touchAction: 'none',
					transform: isDragging
						? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`
						: undefined,
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
						className="absolute z-50 flex items-center justify-center w-6 h-6 text-xs font-bold text-white transition-transform rounded-full shadow-lg cursor-pointer -top-2 -right-2 bg-error hover:scale-110 active:scale-95"
						title="حذف ویجت"
					>
						✕
					</button>
				)}

				<div
					className={cn(
						'w-full h-full relative',
						canvasMode === 'edit' && 'pointer-events-none select-none'
					)}
				>
					{definition.node(widget.instanceId, widget.size, widget.meta)}
					{isLocked && canvasMode === 'normal' && (
						<div
							className="absolute inset-0 z-25 rounded-widget bg-content bg-glass border border-warning/25 flex flex-col items-center justify-center p-1.5 text-center select-none cursor-default overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							<div
								className={cn(
									'rounded-full bg-warning/15 text-warning flex items-center justify-center shadow-2xs',
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
