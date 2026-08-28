import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { useFreeWidgets } from '@/context/free-widget.context'
import { useContainerSize } from '@/hooks/use-container-size'
import { getCanvasHeight } from '../grid-geometry'
import { WIDGET_DEFINITIONS } from '../widget-registry'
import { AddWidgetModal, WidgetHelpModal } from '@/layouts/widgets-manager'
import { CanvasContextMenu } from './canvas-context-menu'
import { CanvasWidgetOuter } from './canvas-widget-outer'
import { CanvasEditToolbar } from './canvas-edit-toolbar'

export function FreeWidgetCanvas() {
	const containerRef = useRef<HTMLDivElement>(null)
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
		setSelectedInstanceId,
		updateContainerWidth,
		removeWidget,
	} = useFreeWidgets()

	const [isAddModalOpen, setIsAddModalOpen] = useState(false)
	const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
	const [editTarget, setEditTarget] = useState<{
		instanceId: string
		widgetId: string
	} | null>(null)
	const [canvasContextMenuPos, setCanvasContextMenuPos] = useState<{
		x: number
		y: number
	} | null>(null)
	const pressStartedOnBackgroundRef = useRef(false)

	useEffect(() => {
		if (containerSize.width > 0) {
			updateContainerWidth(containerSize.width)
		}
	}, [containerSize.width, updateContainerWidth])

	useEffect(() => {
		const removeListener = listenEvent(
			'openAddCustomWidgetModal',
			(payload?: any) => {
				if (payload?.instanceId && payload?.widgetId) {
					setEditTarget(payload)
				} else {
					setEditTarget(null)
				}
				setIsAddModalOpen(true)
			}
		)
		return () => removeListener()
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

	const isBackgroundTarget = (target: EventTarget | null) =>
		target === containerRef.current ||
		(target as HTMLElement)?.classList?.contains('canvas-background')

	const handleCanvasPointerDown = (e: React.PointerEvent) => {
		pressStartedOnBackgroundRef.current = isBackgroundTarget(e.target)
	}

	const handleCanvasClick = (e: React.MouseEvent) => {
		const startedOnBackground = pressStartedOnBackgroundRef.current
		pressStartedOnBackgroundRef.current = false

		if (!startedOnBackground || !isBackgroundTarget(e.target)) return

		if (canvasMode === 'edit') {
			setCanvasMode('normal')
			setSelectedInstanceId(null)
		}
	}

	const handleCanvasContextMenu = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement
		if (
			target === containerRef.current ||
			target.classList.contains('canvas-background')
		) {
			e.preventDefault()
			setCanvasContextMenuPos({ x: e.clientX, y: e.clientY })
		}
	}

	const maxWidgetRow = Math.max(
		0,
		...runtimeLayout.map((w) => w.position.row + w.size.h)
	)
	const totalGridRows = Math.max(6, maxWidgetRow + 2)
	const canvasPixelHeight = Math.max(
		totalGridRows * cellHeight + Math.max(0, totalGridRows - 1) * gap,
		getCanvasHeight(runtimeLayout, cellHeight, gap)
	)

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
						<div
							key={widget.instanceId}
							className="relative w-full p-2 border rounded-2xl bg-base-200/80 border-base-content/10"
						>
							<div className="flex items-center justify-between pb-1 mb-2 border-b border-base-content/10">
								<div className="flex items-center gap-1.5 font-bold text-xs text-content">
									<span>{def.emoji}</span>
									<span>{def.label}</span>
								</div>
								<button
									type="button"
									onClick={() => removeWidget(widget.instanceId)}
									className="text-error text-xs hover:bg-error/10 px-2 py-0.5 rounded-lg transition-colors"
								>
									حذف
								</button>
							</div>
							<div className="w-full">
								{def.node(widget.instanceId, widget.size)}
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	return (
		<div
			ref={containerRef}
			id="widgets-canvas"
			className="relative w-full select-none"
			onPointerDown={handleCanvasPointerDown}
			onClick={handleCanvasClick}
			onContextMenu={handleCanvasContextMenu}
		>
			<div
				className="relative w-full transition-all duration-300 canvas-background rounded-3xl"
				style={{
					minHeight: `${canvasPixelHeight}px`,
					height: `${canvasPixelHeight}px`,
				}}
			>
				{canvasMode === 'edit' && (
					<CanvasEditToolbar
						onAddWidget={() => setIsAddModalOpen(true)}
						onExitEditMode={() => {
							setCanvasMode('normal')
							setSelectedInstanceId(null)
						}}
					/>
				)}

				{canvasMode === 'edit' && (
					<div
						className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl"
						style={{
							gap: `${gap}px`,
						}}
					>
						{Array.from({ length: totalGridRows }).map((_, r) => (
							<div
								key={r}
								className="absolute flex w-full"
								style={{
									top: `${r * (cellHeight + gap)}px`,
									height: `${cellHeight}px`,
									left: 0,
									gap: `${gap}px`,
								}}
							>
								{Array.from({ length: cols }).map((_, c) => (
									<div
										key={c}
										style={{
											width: `${cellWidth}px`,
											height: `${cellHeight}px`,
										}}
										className="transition-all duration-200 border border-dashed rounded-widget border-base-content/15 bg-base-300/10"
									/>
								))}
							</div>
						))}
					</div>
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
							maxRows={totalGridRows}
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
					onOpenAddWidget={() => setIsAddModalOpen(true)}
					onOpenAppearanceSettings={() =>
						callEvent('openSettings', 'appearance')
					}
					onOpenHelp={() => setIsHelpModalOpen(true)}
				/>
			)}

			<AddWidgetModal
				isOpen={isAddModalOpen}
				editTarget={editTarget}
				onClose={() => {
					setIsAddModalOpen(false)
					setEditTarget(null)
				}}
			/>

			<WidgetHelpModal
				isOpen={isHelpModalOpen}
				onClose={() => setIsHelpModalOpen(false)}
			/>
		</div>
	)
}
