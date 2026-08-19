import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { callEvent } from '@/common/utils/call-event'
import { useContainerSize } from '@/hooks/use-container-size'
import { useFreeWidgets } from '@/context/free-widget.context'
import { getCanvasHeight } from '../grid-geometry'
import { WIDGET_DEFINITIONS } from '../widget-registry'
import { AddWidgetModal } from './add-widget-modal'
import { CanvasContextMenu } from './canvas-context-menu'
import { CanvasWidgetOuter } from './canvas-widget-outer'

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
		canvasMode,
		setCanvasMode,
		setSelectedInstanceId,
		updateContainerWidth,
		resetToDefaultLayout,
		removeWidget,
	} = useFreeWidgets()

	const [isAddModalOpen, setIsAddModalOpen] = useState(false)
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
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && canvasMode === 'edit') {
				setCanvasMode('normal')
				setSelectedInstanceId(null)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [canvasMode, setCanvasMode, setSelectedInstanceId])

	const handleCanvasClick = (e: React.MouseEvent) => {
		if (
			e.target === containerRef.current ||
			(e.target as HTMLElement).classList.contains('canvas-background')
		) {
			if (canvasMode === 'edit') {
				setCanvasMode('normal')
				setSelectedInstanceId(null)
			}
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
	const totalGridRows = Math.max(4, maxWidgetRow + 1)
	const canvasPixelHeight = Math.max(
		totalGridRows * cellHeight + Math.max(0, totalGridRows - 1) * gap,
		getCanvasHeight(runtimeLayout, cellHeight, gap)
	)

	if (isListFallback) {
		const sortedList = [...runtimeLayout].sort((a, b) => {
			if (a.position.row !== b.position.row) {
				return a.position.row - b.position.row
			}
			return a.position.col - b.position.col
		})

		return (
			<div ref={containerRef} className="w-full flex flex-col gap-3 py-2 px-1">
				{sortedList.map((widget) => {
					const def = WIDGET_DEFINITIONS[widget.id]
					if (!def) return null

					return (
						<div
							key={widget.instanceId}
							className="relative w-full rounded-2xl bg-base-200/80 border border-base-content/10 p-2"
						>
							<div className="flex items-center justify-between mb-2 pb-1 border-b border-base-content/10">
								<div className="flex items-center gap-1.5 font-bold text-xs text-content">
									<span>{def.emoji}</span>
									<span>{def.label}</span>
								</div>
								<div className="flex items-center gap-1">
									{def.settingsTab && (
										<button
											type="button"
											onClick={() => {
												if (def.settingsTab) {
													callEvent('openWidgetsSettings', {
														tab: def.settingsTab,
													})
												}
											}}
											className="text-xs px-2 py-0.5 rounded-lg bg-base-300 text-content cursor-pointer hover:bg-base-100"
										>
											تنظیمات
										</button>
									)}
									<button
										type="button"
										onClick={() => removeWidget(widget.instanceId)}
										className="text-xs px-2 py-0.5 rounded-lg bg-error/20 text-error"
									>
										حذف
									</button>
								</div>
							</div>
							<div className="w-full min-h-24">
								{def.node(widget.instanceId, widget.size)}
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	return (
		<div className="relative w-full flex flex-col items-center">
			{canvasMode === 'edit' && (
				<div className="sticky top-2 z-40 mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
					<span className="text-xs font-medium">
						حالت ویرایش ویجت‌ها فعال است
					</span>
					<button
						type="button"
						onClick={() => setIsAddModalOpen(true)}
						className="px-2.5 py-0.5 text-xs rounded-full bg-white/20 hover:bg-white/30 text-white font-medium cursor-pointer transition-colors"
					>
						+ افزودن ویجت
					</button>
					<button
						type="button"
						onClick={() => {
							setCanvasMode('normal')
							setSelectedInstanceId(null)
						}}
						className="px-2.5 py-0.5 text-xs rounded-full bg-white/20 hover:bg-white/30 text-white font-medium cursor-pointer transition-colors"
					>
						اتمام ویرایش
					</button>
				</div>
			)}

			<div
				ref={containerRef}
				onClick={handleCanvasClick}
				onContextMenu={handleCanvasContextMenu}
				className="canvas-background relative w-full transition-all duration-200"
				style={{
					minHeight: `${Math.max(320, canvasPixelHeight)}px`,
					height: `${canvasPixelHeight}px`,
				}}
			>
				{canvasMode === 'edit' && (
					<div
						className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
						aria-hidden="true"
					>
						{Array.from({ length: totalGridRows }).map((_, r) => (
							<div
								key={r}
								className="absolute flex"
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
										className="rounded-2xl border border-dashed border-base-content/15 bg-base-300/10 transition-all duration-200"
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
					onOpenAppearanceSettings={() => callEvent('openSettings')}
					onResetLayout={resetToDefaultLayout}
				/>
			)}

			<AddWidgetModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
			/>
		</div>
	)
}
