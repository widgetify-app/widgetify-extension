import {
	useEffect,
	useLayoutEffect,
	useState,
	type CSSProperties,
	type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
	children: ReactNode
	container?: Element | null
	topLayer?: boolean
	id?: string
	className?: string
	style?: CSSProperties
}

const TOP_LAYER_HOST_CSS =
	'position:fixed;inset:0;width:auto;height:auto;max-width:none;max-height:none;margin:0;padding:0;border:none;background:transparent;overflow:visible;color:inherit;pointer-events:none;'

function topmostModalDialog(): HTMLElement | null {
	let topmost: HTMLElement | null = null

	try {
		for (const dialog of document.querySelectorAll('dialog[open]')) {
			if (dialog.matches(':modal')) topmost = dialog as HTMLElement
		}
	} catch {
		return null
	}

	return topmost
}

export function raiseToTopLayer(host: HTMLElement | null) {
	if (!host) return

	const parent = topmostModalDialog() ?? document.body

	if (host.parentElement !== parent) {
		parent.appendChild(host)

		if (parent !== document.body) {
			parent.addEventListener('close', () => raiseToTopLayer(host), {
				once: true,
			})
		}
	}

	if (typeof host.showPopover !== 'function') return

	try {
		host.hidePopover()
	} catch {}

	try {
		host.showPopover()
	} catch {}
}

type TopLayerHostProps = Pick<PortalProps, 'children' | 'id' | 'className' | 'style'>

function TopLayerHost({ children, id, className, style }: TopLayerHostProps) {
	const [host] = useState(() => {
		const el = document.createElement('div')
		el.setAttribute('popover', 'manual')
		return el
	})

	useLayoutEffect(() => {
		if (id) host.id = id
		host.className = className ?? ''
		host.style.cssText = TOP_LAYER_HOST_CSS
		if (style) Object.assign(host.style, style)
	})

	useEffect(() => {
		raiseToTopLayer(host)

		return () => {
			try {
				host.hidePopover()
			} catch {}
			host.remove()
		}
	}, [host])

	return createPortal(children, host)
}

export function Portal({
	children,
	container = document.body,
	topLayer,
	id,
	className,
	style,
}: PortalProps) {
	if (topLayer) {
		return (
			<TopLayerHost id={id} className={className} style={style}>
				{children}
			</TopLayerHost>
		)
	}

	if (!container) return null

	return createPortal(children, container)
}
