import { useCallback } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
	resolveValue,
	useToaster,
	type Toast,
	type ToastPosition,
} from 'react-hot-toast'
import {
	STACK_VISIBLE_LAYERS,
	getStackAnchor,
	getStackLayer,
	getStackScale,
	getStackShift,
} from './utils/stack-geometry'

const CONTAINER_OFFSET = 16
const CONTAINER_Z_INDEX = 99999999
const DEFAULT_POSITION: ToastPosition = 'top-center'
const STACK_EASING = 'cubic-bezier(.21,1.02,.73,1)'

interface ToastLayerProps {
	id: string
	style: CSSProperties
	className: string
	onHeightUpdate: (id: string, height: number) => void
	children: ReactNode
}

function ToastLayer({
	id,
	style,
	className,
	onHeightUpdate,
	children,
}: ToastLayerProps) {
	const measure = useCallback(
		(el: HTMLElement | null) => {
			if (!el) return
			const updateHeight = () => onHeightUpdate(id, el.offsetHeight)
			updateHeight()
			const observer = new MutationObserver(updateHeight)
			observer.observe(el, {
				subtree: true,
				childList: true,
				characterData: true,
			})
			return () => observer.disconnect()
		},
		[id, onHeightUpdate]
	)

	return (
		<div ref={measure} style={style} className={className}>
			{children}
		</div>
	)
}

function getLayerStyle(
	position: ToastPosition,
	depth: number,
	height: number | undefined,
	tallestHeight: number | undefined
): CSSProperties {
	const fromTop = position.includes('top')
	const anchor = getStackAnchor(position)
	const layer = getStackLayer(depth)
	const scale = getStackScale(layer)
	const shift = getStackShift(layer, height, tallestHeight)

	return {
		position: 'absolute',
		left: 0,
		right: 0,
		display: 'flex',
		justifyContent:
			anchor === 'center' ? 'center' : anchor === 'right' ? 'flex-end' : 'flex-start',
		...(fromTop ? { top: 0 } : { bottom: 0 }),
		transform: `translateY(${fromTop ? shift : -shift}px) scale(${scale})`,
		transformOrigin: `${fromTop ? 'top' : 'bottom'} ${anchor}`,
		opacity: depth < STACK_VISIBLE_LAYERS ? 1 : 0,
		zIndex: 1000 - depth,
		pointerEvents: 'none',
		transition: `transform 260ms ${STACK_EASING}, opacity 260ms ${STACK_EASING}`,
	}
}

function groupByPosition(toasts: Toast[]) {
	const groups = new Map<ToastPosition, Toast[]>()
	for (const item of toasts) {
		const position = item.position || DEFAULT_POSITION
		const group = groups.get(position)
		if (group) {
			group.push(item)
		} else {
			groups.set(position, [item])
		}
	}
	return groups
}

export function StackedToaster() {
	const { toasts, handlers } = useToaster()
	const groups = groupByPosition(toasts)

	return (
		<div
			style={{
				position: 'fixed',
				zIndex: CONTAINER_Z_INDEX,
				top: CONTAINER_OFFSET,
				left: CONTAINER_OFFSET,
				right: CONTAINER_OFFSET,
				bottom: CONTAINER_OFFSET,
				pointerEvents: 'none',
			}}
			onMouseEnter={handlers.startPause}
			onMouseLeave={handlers.endPause}
		>
			{[...groups.values()].flatMap((group) => {
				const tallestHeight = Math.max(
					0,
					...group.filter((item) => item.visible).map((item) => item.height ?? 0)
				)

				return group.map((item, index) => {
					const depth = group
						.slice(0, index)
						.filter((other) => other.visible).length
					const position = item.position || DEFAULT_POSITION
					const isFront = item.visible && depth === 0

					return (
						<ToastLayer
							key={item.id}
							id={item.id}
							onHeightUpdate={handlers.updateHeight}
							className={
								isFront
									? '[&>*]:pointer-events-auto'
									: '[&>*]:pointer-events-none'
							}
							style={getLayerStyle(
								position,
								depth,
								item.height,
								tallestHeight
							)}
						>
							{resolveValue(item.message, item)}
						</ToastLayer>
					)
				})
			})}
		</div>
	)
}
