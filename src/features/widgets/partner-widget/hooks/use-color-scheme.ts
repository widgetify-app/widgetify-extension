import { useEffect, useState } from 'react'
import { colorSchemeOf } from '../utils/protocol'

function readColorScheme(): 'light' | 'dark' {
	return colorSchemeOf(getComputedStyle(document.documentElement).colorScheme)
}

export function useColorScheme(theme: string): 'light' | 'dark' {
	const [scheme, setScheme] = useState(readColorScheme)

	useEffect(() => {
		setScheme(readColorScheme())

		const observer = new MutationObserver(() => setScheme(readColorScheme()))

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme', 'style', 'class'],
		})

		return () => observer.disconnect()
	}, [theme])

	return scheme
}
