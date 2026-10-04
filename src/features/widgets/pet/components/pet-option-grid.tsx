import { type ReactNode, useEffect, useRef } from 'react'
import { cn } from '@/common/utils/cn'

interface Prop {
	labelledBy: string
	className: string
	children: ReactNode
}

export function PetOptionGrid({ labelledBy, className, children }: Prop) {
	const gridRef = useRef<HTMLFieldSetElement>(null)

	useEffect(() => {
		const grid = gridRef.current
		const selected = grid?.querySelector<HTMLElement>('[aria-pressed="true"]')
		if (!grid || !selected) return
		if (selected.offsetTop + selected.offsetHeight > grid.clientHeight) {
			grid.scrollTop = selected.offsetTop - grid.clientHeight / 2
		}
	}, [])

	return (
		<fieldset
			ref={gridRef}
			aria-labelledby={labelledBy}
			className={cn(
				'relative grid auto-rows-max gap-2 p-0.5 overflow-y-auto',
				className
			)}
		>
			{children}
		</fieldset>
	)
}
