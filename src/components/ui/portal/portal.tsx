import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
	children: ReactNode
	container?: Element | null
}

export function Portal({ children, container = document.body }: PortalProps) {
	if (!container) return null

	return createPortal(children, container)
}
