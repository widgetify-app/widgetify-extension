import { cn } from '@/src/utils/cn'
import { memo } from 'react'

/**
 * Props for the CustomCheckbox component.
 *
 * Provides granular control over styling, state management, and interaction
 * handlers. Supports both controlled and uncontrolled patterns via onChange.
 */
interface CustomCheckboxProps {
	/** Whether the checkbox is currently checked (controlled prop) */
	checked: boolean
	/** Fired when the user toggles the checkbox (controlled mode) */
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	/** Label text displayed next to the checkbox */
	label?: string
	/** Click handler for custom interaction logic (fires after onChange if not disabled) */
	onClick?: (e: React.MouseEvent<HTMLInputElement>) => void
	/** Additional CSS classes merged with computed styles via cn() */
	className?: string
	/** Disables interaction and dims visual appearance */
	disabled?: boolean
	/** CSS classes applied when checkbox is unchecked (overrides default border-content) */
	unCheckedCheckBoxClassName?: string
	/** CSS classes applied when checkbox is checked (overrides default blue background) */
	checkedCheckBoxClassName?: string
	/** Font weight for label text: 'font-light', 'font-normal', or 'font-bold' */
	fontSize?: 'font-light' | 'font-normal' | 'font-bold'
}

/**
 * A styled, accessible checkbox component built with HTML5 `<input type="checkbox">`.
 *
 * Features:
 * - Animated checkmark that scales in/out on toggle
 * - Customizable checked/unchecked styles via className props
 * - Disabled state prevents interaction and changes cursor
 * - Memoized to prevent unnecessary re-renders
 * - Uses semantic `<label>` element for better accessibility and click target
 *
 * The `cn()` utility merges provided className overrides with computed state-based
 * styles, ensuring no conflicting Tailwind utilities (e.g., border colors).
 *
 * @example
 * ```tsx
 * const [isChecked, setIsChecked] = useState(false)
 *
 * <CustomCheckbox
 *   checked={isChecked}
 *   onChange={(e) => setIsChecked(e.target.checked)}
 *   label="I agree to the terms"
 *   fontSize="font-semibold"
 * />
 * ```
 */
const CustomCheckbox = ({
	checked,
	onChange,
	label,
	disabled = false,
	fontSize = 'font-normal',
	className = '',
	unCheckedCheckBoxClassName = '',
	checkedCheckBoxClassName = '',
	onClick,
}: CustomCheckboxProps) => {
	/**
	 * Determines the appropriate Tailwind classes for the checkbox box
	 * based on checked state and user-provided overrides.
	 *
	 * Priority: checkedCheckBoxClassName > default checked style
	 */
	const getCheckboxStyle = () => {
		if (checked) {
			if (checkedCheckBoxClassName) return checkedCheckBoxClassName
			return 'bg-blue-500 border-blue-500'
		}

		if (unCheckedCheckBoxClassName) return unCheckedCheckBoxClassName
		return 'border-content'
	}

	/**
	 * Wrapper for onChange that prevents default browser behavior
	 * and respects the disabled state.
	 */
	const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		if (!disabled) {
			onChange?.(e)
		}
	}

	/**
	 * Wrapper for onClick that prevents default browser behavior
	 * and respects the disabled state.
	 */
	const onClickEvent = (e: React.MouseEvent<HTMLInputElement>) => {
		e.preventDefault()
		if (!disabled) {
			onClick?.(e)
		}
	}

	return (
		<label className="relative flex items-center transition-transform cursor-pointer group active:scale95">
			<div className="relative">
				{/* Hidden native checkbox for accessibility and form submission */}
				<input
					type="checkbox"
					className="sr-only"
					checked={checked}
					onChange={onChangeEvent}
					disabled={disabled}
					onClick={onClickEvent}
				/>
				{/* Visual checkbox box with animated checkmark */}
				<div
					className={cn(
						'w-5 h-5 border rounded-md flex items-center justify-center transition-colors duration-200',
						getCheckboxStyle(),
						className
					)}
				>
					{/* SVG checkmark animates in/out via scale transform */}
					<svg
						className={`transition-all duration-150 ${
							checked ? 'scale-100' : 'scale-0'
						}`}
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
					>
						<path
							className={`transition-all duration-200 ${
								checked ? 'stroke-dashoffset-0' : 'stroke-dashoffset-full'
							}`}
							d="M2.5 6L5 8.5L9.5 4"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeDasharray="1"
							strokeDashoffset={checked ? '0' : '1'}
						/>
					</svg>
				</div>
			</div>
			{/* Label text with configurable font weight */}
			{label && (
				<span className={cn('ml-2 mr-2 text-sm text-content', fontSize)}>
					{label}
				</span>
			)}
		</label>
	)
}

export default memo(CustomCheckbox)
