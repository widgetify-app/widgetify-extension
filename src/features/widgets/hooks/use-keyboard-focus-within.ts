import { type FocusEvent, useState } from 'react'

export function useKeyboardFocusWithin() {
	const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false)

	return {
		'data-keyboard-focus': hasKeyboardFocus || undefined,
		onFocus: (event: FocusEvent<HTMLElement>) => {
			setHasKeyboardFocus(event.target.matches(':focus-visible'))
		},
		onBlur: (event: FocusEvent<HTMLElement>) => {
			if (!event.currentTarget.contains(event.relatedTarget)) {
				setHasKeyboardFocus(false)
			}
		},
	}
}
