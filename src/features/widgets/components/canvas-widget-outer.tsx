import type React from 'react'
import {
	memo,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import Analytics from '@/analytics'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { useFreeWidgetActions } from '@/features/widgets/widgets.context'
import { getWidgetPixelRect } from '../utils/grid-geometry'
import { useKeyboardFocusWithin } from '../hooks/use-keyboard-focus-within'
import { useDragAutoScroll } from '../hooks/use-drag-auto-scroll'
import { rowCapFor } from '../utils/layout-engine/row-cap'
import {
	type StoredWidget,
	type WidgetDefinition,
	WidgetKeys,
	type WidgetPosition,
	type WidgetSize,
} from '../utils/layout-engine/types'
import { cn } from '@/common/utils/cn'
import { useAuth } from '@/context/auth.context'
import { VipBadge } from '@/components/ui'
import { useWidgetVipResolver } from '@/features/widgets/hooks/use-widget-vip-resolver'
import { WidgetMenuProvider } from '../widget-menu.context'
import { type WidgetMenuAnchor, WidgetContextMenu } from './widget-context-menu'
import { BookmarkDeleteModal } from './bookmark-delete-modal'
import { WidgetMenuButton } from './widget-menu-button'
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
	const keyboardFocus = useKeyboardFocusWithin()
	const { isWidgetVipOnly, isVariantVipOnly, isSizeVipOnly } = useWidgetVipResolver()
	const {
		setCanvasMode,
		setSelectedInstanceId,
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
	const [menuAnchor, setMenuAnchor] = useState<WidgetMenuAnchor | null>(null)
	const menuActionsRef = useRef<ReactNode>(null)
	const settingsSummaryRef = useRef<string | null>(null)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const isWiggling = canvasMode === 'edit' && !isSelected

	const outerRef = useRef<HTMLDivElement>(null)
	const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
	const dragStartPosRef = useRef<WidgetPosition>(widget.position)
	const dragBaseRectRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 })
	const isDragActiveRef = useRef(false)
	const activePointerIdRef = useRef<number | null>(null)
	const rafRef = useRef<number | null>(null)
	const lastPointerRef = useRef<{ x: number; y: number } | null>(null)
	const previewPosRef = useRef<WidgetPosition | null>(null)
	const {
		start: startAutoScroll,
		track: trackAutoScroll,
		stop: stopAutoScroll,
		scrolledBy,
	} = useDragAutoScroll(() => scheduleDragFrame())

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
		stopAutoScroll()
		pointerStartRef.current = null
		isDragActiveRef.current = false
		activePointerIdRef.current = null
		lastPointerRef.current = null
		previewPosRef.current = null
		setIsDragging(false)
	}, [stopAutoScroll])

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
			target.closest('.cursor-pointer')
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

		const rowLimit = Math.max(0, rowCapFor(cols) - widget.size.h)

		return {
			col: Math.max(
				0,
				Math.min(cols - widget.size.w, dragStartPosRef.current.col + deltaCol)
			),
			row: Math.max(0, Math.min(rowLimit, dragStartPosRef.current.row + deltaRow)),
		}
	}

	const getDragOffset = () => {
		const start = pointerStartRef.current
		const last = lastPointerRef.current
		if (!start || !last) return { x: 0, y: 0 }
		return { x: last.x - start.x, y: last.y - start.y + scrolledBy() }
	}

	const scheduleDragFrame = () => {
		if (rafRef.current !== null) return
		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = null
			if (!isDragActiveRef.current) return

			const offset = getDragOffset()
			const base = dragBaseRectRef.current
			if (outerRef.current) {
				outerRef.current.style.transform = `translate3d(${base.left + offset.x}px, ${base.top + offset.y}px, 0)`
			}

			const target = getTargetPosition(offset)
			const previous = previewPosRef.current
			if (!previous || target.col !== previous.col || target.row !== previous.row) {
				previewPosRef.current = target
				updateDragPreview(widget.instanceId, target)
			}
		})
	}

	const handlePointerMove = (e: React.PointerEvent) => {
		if (canvasMode !== 'edit' || !pointerStartRef.current) return
		if (e.pointerId !== activePointerIdRef.current) return

		lastPointerRef.current = { x: e.clientX, y: e.clientY }

		if (!isDragActiveRef.current) {
			const dx = e.clientX - pointerStartRef.current.x
			const dy = e.clientY - pointerStartRef.current.y
			const dist = Math.sqrt(dx * dx + dy * dy)

			const dragThreshold = 6

			if (dist <= dragThreshold) return

			isDragActiveRef.current = true
			previewPosRef.current = { ...dragStartPosRef.current }
			startDragPreview()
			setIsDragging(true)
			startAutoScroll(outerRef.current, e.clientY)
			try {
				;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
			} catch {}
		}

		trackAutoScroll(e.clientY)
		scheduleDragFrame()
	}

	const handlePointerUp = (e: React.PointerEvent) => {
		if (e.pointerId !== activePointerIdRef.current) return

		const dropTarget = isDragActiveRef.current
			? getTargetPosition(getDragOffset())
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
		if (canvasMode === 'edit') return
		const isFromKeyboard = e.clientX === 0 && e.clientY === 0
		const frame = outerRef.current?.getBoundingClientRect()
		setMenuAnchor({
			point:
				isFromKeyboard && frame
					? { x: frame.left + 12, y: frame.top + 44 }
					: { x: e.clientX, y: e.clientY },
		})
		Analytics.event('widget_context_menu_opened')
	}

	const closeMenu = useCallback(() => setMenuAnchor(null), [])

	const isMenuOpen = menuAnchor !== null
	const menuContext = useMemo(
		() => ({
			isOpen: isMenuOpen,
			toggleFromButton: (button: HTMLElement) =>
				setMenuAnchor((current) => {
					if (current) return null
					Analytics.event('widget_context_menu_opened')
					return { trigger: { current: button } }
				}),
			actionsRef: menuActionsRef,
			settingsSummaryRef,
		}),
		[isMenuOpen]
	)

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
			<article
				aria-label={definition.label}
				ref={outerRef}
				data-widget
				{...keyboardFocus}
				data-menu-open={isMenuOpen || undefined}
				data-editing={canvasMode === 'edit' || undefined}
				className={cn(
					'absolute top-0 left-0 select-none rounded-widget',
					isDragging ? 'z-50 shadow-xl cursor-grabbing' : 'z-10 cursor-default',
					!isDragging &&
						'transition-[transform,width,height] duration-200 ease-out'
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
						if (target.closest('[data-widget-delete]')) return
						e.preventDefault()
						e.stopPropagation()
					}
				}}
			>
				{canvasMode === 'edit' && (
					<button
						type="button"
						aria-label="حذف ویجت"
						data-widget-delete
						onPointerDown={(e) => e.stopPropagation()}
						onPointerUp={(e) => e.stopPropagation()}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							handleDelete()
						}}
						className="absolute z-50 flex items-center justify-center w-6 h-6 text-xs font-bold text-on-danger transition-transform rounded-full shadow-lg cursor-pointer -top-2 -right-2 bg-danger hover:scale-110 active:scale-95"
					>
						✕
					</button>
				)}

				<WidgetMenuProvider value={menuContext}>
					<div
						className={cn(
							'w-full h-full relative',
							canvasMode === 'edit' && 'pointer-events-none select-none',
							isWiggling && WIGGLE_CLASSES[wiggleVariant]
						)}
					>
						{(!isLocked || canvasMode === 'edit') && (
							<WidgetSlot
								definition={definition}
								instanceId={widget.instanceId}
								size={widget.size}
								meta={widget.meta}
							/>
						)}
						{isLocked && canvasMode === 'normal' && (
							<button
								type="button"
								aria-label="ارتقا به اشتراک پرو"
								className="absolute inset-0 z-25 rounded-widget bg-glass-surface-2 border border-vip-fill-2 flex flex-col items-center justify-center p-2 text-center select-none cursor-pointer overflow-hidden group transition-ui duration-200 hover:border-vip"
								onClick={(e) => {
									e.stopPropagation()
									callEvent('openSettings', 'vip')
								}}
							>
								<div className="flex flex-col items-center gap-1.5 transition-transform duration-200 group-hover:scale-105">
									<VipBadge
										size={isCompactSize ? 'xs' : 'sm'}
										variant="solid"
									/>
									{!isCompactSize && (
										<span className="text-2xs font-medium text-fg-muted transition-colors duration-200 group-hover:text-fg">
											ارتقا به اشتراک پرو
										</span>
									)}
								</div>
							</button>
						)}
						{isLocked && canvasMode === 'normal' && (
							<WidgetMenuButton placement="floating" />
						)}
						{canvasMode === 'edit' && (
							<div className="absolute inset-0 z-30 bg-transparent pointer-events-auto cursor-grab" />
						)}
					</div>
				</WidgetMenuProvider>
			</article>

			{menuAnchor && (
				<WidgetContextMenu
					anchor={menuAnchor}
					widget={widget}
					definition={definition}
					cols={cols}
					actions={menuActionsRef.current}
					settingsSummary={settingsSummaryRef.current}
					onClose={closeMenu}
					onResize={handleResize}
					onDuplicate={handleDuplicate}
					onMove={handleMove}
					onSettings={
						definition.settingsTab &&
						(definition.hasSettings?.(widget.meta) ?? true)
							? handleSettings
							: undefined
					}
					onEditVariant={
						definition.variants?.length ? handleEditVariant : undefined
					}
					onDelete={handleDelete}
				/>
			)}

			{widget.id === WidgetKeys.bookmarks && showDeleteConfirm && (
				<BookmarkDeleteModal
					isOpen={showDeleteConfirm}
					onClose={() => setShowDeleteConfirm(false)}
					onConfirm={() => {
						setShowDeleteConfirm(false)
						removeWidget(widget.instanceId)
					}}
				/>
			)}
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
