import { cn } from '@/src/utils/cn'
import type React from 'react'

/**
 * Props interface for the Chip component.
 *
 * A chip is a compact, dismissible tag-like element often used in
 * filter bars, tag selections, or multi-select interfaces.
 */
interface ChipProps {
	/** Whether the chip is currently selected/active */
	selected: boolean
	/** Callback fired when the chip is clicked */
	onClick: () => void
	/** Chip label or content */
	children: React.ReactNode
	/** Additional CSS classes merged with computed state styles (Tailwind-safe) */
	className?: string
	/** Sets text direction: 'ltr' (left-to-right) or 'rtl' (right-to-left) for RTL languages */
	dir?: string
}

/**
 * A selectable chip component used for filtering, tagging, or option selection.
 *
 * Visual behavior:
 * - **Selected**: Primary blue background with white text, solid border
 * - **Unselected**: Light gray background, semi-transparent border, text changes color on hover
 *
 * The `cn()` utility handles merging selected/unselected state styles with any user-provided
 * className overrides, preventing Tailwind utility conflicts (e.g., multiple background colors).
 *
 * Accessibility: Renders as a native `<button>` for screen reader compatibility and
 * keyboard navigation support.
 *
 * @example
 * ```tsx
 * const [selected, setSelected] = useState<string[]>([])
 *
 * const options = ['Filter A', 'Filter B', 'Filter C']
 *
 * {options.map((opt) => (
 *   <Chip
 *     key={opt}
 *     selected={selected.includes(opt)}
 *     onClick={() => setSelected(prev => prev.includes(opt)
 *       ? prev.filter(s => s !== opt)
 *       : [...prev, opt]
 *     )}
 *   >
 *     {opt}
 *   </Chip>
 * ))}
 * ```
 */
export const Chip: React.FC<ChipProps> = ({
	selected,
	onClick,
	children,
	className = '',
	dir,
}) => {
	return (
		<button
			onClick={onClick}
			className={cn(
				'px-4 py-2 cursor-pointer rounded-full text-xs font-bold transition-all border-2',
				selected
					? 'bg-primary border-primary text-white'
					: 'bg-base-100 border-base-300/30 text-muted hover:border-primary/30',
				className
			)}
			dir={dir}
			type="button"
		>
			{children}
		</button>
	)
}
