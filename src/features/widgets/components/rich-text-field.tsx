import { lazy, Suspense } from 'react'

const RichTextEditor = lazy(() => import('./rich-text-editor'))

export interface RichTextFieldProps {
	value: string
	onChange: (markdown: string) => void
	placeholder?: string
	ariaLabel: string
	isOnColor?: boolean
	className?: string
}

export function RichTextField(props: RichTextFieldProps) {
	return (
		<Suspense fallback={<div className="flex-1 min-h-0" />}>
			<RichTextEditor {...props} />
		</Suspense>
	)
}
