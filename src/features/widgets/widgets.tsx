import type React from 'react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { useFreeWidgets } from '@/features/widgets/widgets.context'
import { useContainerSize } from '@/features/widgets/hooks/use-container-size'
import { getCanvasHeight } from './utils/grid-geometry'
import { useKeyboardFocusWithin } from './hooks/use-keyboard-focus-within'
import { MIN_CANVAS_ROWS } from './utils/layout-engine/constants'
import { rowCapFor } from './utils/layout-engine/row-cap'
import { WIDGET_DEFINITIONS } from './registry'
import { WidgetHelpModal } from '@/features/widgets/components/widget-help-modal'
import { PresetLayoutModal } from './presets/presets'
import { CanvasContextMenu } from './components/canvas-context-menu'
import { CanvasWidgetOuter } from './components/canvas-widget-outer'
import { CanvasEditToolbar } from './components/canvas-edit-toolbar'
import { GridOverlay } from './components/grid-overlay'

export function FreeWidgetCanvas() {
	const containerRef = useRef<HTMLDivElement>(null)
	const backgroundRef = useRef<HTMLDivElement>(null)
	const containerSize = useContainerSize(containerRef)

	const {
		runtimeLayout,
		cols,
		cellWidth,
		cellHeight,
		gap,
		isListFallback,
		isLoaded,
		canvasMode,
		setCanvasMode,
		selectedInstanceId,
		setSelectedInstanceId,
		updateContainerWidth,
		removeWidget,
	} = useFreeWidgets()

	const [isPresetModalOpen, setIsPresetModalOpen] = useState(false)
	const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

	const handleClosePresetModal = useCallback(() => {
		setIsPresetModalOpen(false)
	}, [])

	const handleCloseHelpModal = useCallback(() => {
		setIsHelpModalOpen(false)
	}, [])
	const [canvasContextMenuPos, setCanvasContextMenuPos] = useState<{
		x: number
		y: number
	} | null>(null)

	useEffect(() => {
		if (containerSize.width > 0) {
			updateContainerWidth(containerSize.width)
		}
	}, [containerSize.width, updateContainerWidth])

	useEffect(() => {
		const removePresetListener = listenEvent('openPresetLayoutsModal', () => {
			setIsPresetModalOpen(true)
		})
		return () => {
			removePresetListener()
		}
	}, [])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && canvasMode === 'edit') {
				callEvent('cancelWidgetDrag', null)
				setSelectedInstanceId(null)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [canvasMode, setSelectedInstanceId])

	useEffect(() => {
		if (canvasMode !== 'edit') return

		const isEmptySpace = (target: EventTarget | null) =>
			target instanceof Node &&
			(target === backgroundRef.current || target.contains(containerRef.current))

		let pressedOnEmptySpace = false

		const handlePointerDown = (e: PointerEvent) => {
			pressedOnEmptySpace = e.button === 0 && isEmptySpace(e.target)
		}

		const handlePointerUp = (e: PointerEvent) => {
			const startedOnEmptySpace = pressedOnEmptySpace
			pressedOnEmptySpace = false
			if (!startedOnEmptySpace || !isEmptySpace(e.target)) return

			setCanvasMode('normal')
			setSelectedInstanceId(null)
		}

		document.addEventListener('pointerdown', handlePointerDown)
		document.addEventListener('pointerup', handlePointerUp)
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown)
			document.removeEventListener('pointerup', handlePointerUp)
		}
	}, [canvasMode, setCanvasMode, setSelectedInstanceId])

	const isBackgroundTarget = (target: EventTarget | null) =>
		target === containerRef.current || target === backgroundRef.current

	const handleCanvasContextMenu = (e: React.MouseEvent) => {
		if (isBackgroundTarget(e.target)) {
			e.preventDefault()
			setCanvasContextMenuPos({ x: e.clientX, y: e.clientY })
		}
	}

	const maxWidgetRow = Math.max(
		0,
		...runtimeLayout.map((w) => w.position.row + w.size.h)
	)
	const rowCap = Math.max(rowCapFor(cols), maxWidgetRow)
	const totalGridRows =
		canvasMode === 'edit'
			? rowCap
			: Math.max(MIN_CANVAS_ROWS, Math.min(maxWidgetRow + 2, rowCap))
	const canvasPixelHeight = Math.max(
		totalGridRows * cellHeight + Math.max(0, totalGridRows - 1) * gap,
		getCanvasHeight(runtimeLayout, cellHeight, gap)
	)

	const wiggleVariants = useMemo(() => {
		const variants = new Map<string, number>()
		for (const widget of runtimeLayout) {
			let hash = 0
			for (let i = 0; i < widget.instanceId.length; i++) {
				hash = (hash * 31 + widget.instanceId.charCodeAt(i)) | 0
			}
			variants.set(widget.instanceId, Math.abs(hash) % 3)
		}
		return variants
	}, [runtimeLayout])

	if (!isLoaded) {
		return <div ref={containerRef} className="w-full min-h-[300px]" />
	}

	if (isListFallback) {
		const sortedList = [...runtimeLayout].sort((a, b) => {
			if (a.position.row !== b.position.row) {
				return a.position.row - b.position.row
			}
			return a.position.col - b.position.col
		})

		return (
			<div ref={containerRef} className="flex flex-col w-full gap-3 px-1 py-2">
				{sortedList.map((widget) => {
					const def = WIDGET_DEFINITIONS[widget.id]
					if (!def) return null

					return (
						<ListWidgetFrame key={widget.instanceId}>
							<div className="flex items-center justify-between pb-1 mb-2 border-b border-line">
								<div className="flex items-center gap-1.5 font-bold text-xs text-fg">
									<span>{def.emoji}</span>
									<span>{def.label}</span>
								</div>
								<button
									type="button"
									onClick={() => removeWidget(widget.instanceId)}
									className="text-danger text-xs hover:bg-danger-fill px-2 py-0.5 rounded-lg transition-colors"
								>
									حذف
								</button>
							</div>
							<div className="w-full">
								{def.node(widget.instanceId, widget.size, widget.meta)}
							</div>
						</ListWidgetFrame>
					)
				})}
			</div>
		)
	}

	return (
		<section
			aria-label="ویجت‌ها"
			ref={containerRef}
			id="widgets-canvas"
			className="relative w-full select-none"
			onContextMenu={handleCanvasContextMenu}
		>
			<div
				ref={backgroundRef}
				className="relative w-full transition-colors duration-300 rounded-widget"
				style={{
					minHeight: `${canvasPixelHeight}px`,
					height: `${canvasPixelHeight}px`,
				}}
			>
				{canvasMode === 'edit' && (
					<CanvasEditToolbar
						onAddWidget={() => callEvent('openAddCustomWidgetModal')}
						onOpenPresets={() => setIsPresetModalOpen(true)}
						onExitEditMode={() => {
							setCanvasMode('normal')
							setSelectedInstanceId(null)
						}}
					/>
				)}

				{canvasMode === 'edit' && (
					<GridOverlay
						totalGridRows={totalGridRows}
						cols={cols}
						cellWidth={cellWidth}
						cellHeight={cellHeight}
						gap={gap}
					/>
				)}

				{runtimeLayout.map((widget) => {
					const def = WIDGET_DEFINITIONS[widget.id]
					if (!def) return null

					return (
						<CanvasWidgetOuter
							key={widget.instanceId}
							widget={widget}
							definition={def}
							cellWidth={cellWidth}
							cellHeight={cellHeight}
							gap={gap}
							cols={cols}
							canvasMode={canvasMode}
							isSelected={selectedInstanceId === widget.instanceId}
							wiggleVariant={wiggleVariants.get(widget.instanceId) ?? 0}
						/>
					)
				})}
			</div>

			{canvasContextMenuPos && (
				<CanvasContextMenu
					x={canvasContextMenuPos.x}
					y={canvasContextMenuPos.y}
					canvasMode={canvasMode}
					onClose={() => setCanvasContextMenuPos(null)}
					onToggleEditMode={() => {
						setCanvasMode(canvasMode === 'edit' ? 'normal' : 'edit')
						setSelectedInstanceId(null)
					}}
					onOpenAddWidget={() => callEvent('openAddCustomWidgetModal')}
					onOpenPresets={() => setIsPresetModalOpen(true)}
					onOpenAppearanceSettings={() =>
						callEvent('openSettings', 'appearance')
					}
					onOpenWallpaperSettings={() =>
						callEvent('openSettings', 'wallpapers')
					}
					onOpenHelp={() => setIsHelpModalOpen(true)}
				/>
			)}

			<PresetLayoutModal
				isOpen={isPresetModalOpen}
				onClose={handleClosePresetModal}
			/>

			<WidgetHelpModal isOpen={isHelpModalOpen} onClose={handleCloseHelpModal} />
		</section>
	)
}

function ListWidgetFrame({ children }: { children: ReactNode }) {
	const keyboardFocus = useKeyboardFocusWithin()

	return (
		<div
			data-widget
			{...keyboardFocus}
			className="relative w-full p-2 border rounded-2xl bg-fill-2 border-line"
		>
			{children}
		</div>
	)
}
