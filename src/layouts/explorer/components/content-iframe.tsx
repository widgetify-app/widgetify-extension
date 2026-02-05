import { useAppearanceSetting } from '@/context/appearance.context'
import type { CatalogItem } from '../interfaces/catalog-item.interface'
import { useTheme } from '@/context/theme.context'

interface IframeProp {
	link: CatalogItem
}
export function RenderContentIframe({ link }: IframeProp) {
	const { fontFamily } = useAppearanceSetting()
	const { theme } = useTheme()
	const urlObj = new URL(link.url)
	urlObj.searchParams.set('theme', encodeURIComponent(theme))
	urlObj.searchParams.set('font', encodeURIComponent(fontFamily))
	urlObj.searchParams.set('referrer', 'extension')
	const url = urlObj.toString()

	return (
		<div
			className="w-full"
			style={{
				gridColumn: link.span?.col
					? `span ${link.span.col} / span ${link.span.col}`
					: 'span 3 / span 3',
				gridRow: link.span?.row
					? `span ${link.span.row} / span ${link.span.row}`
					: undefined,
			}}
		>
			<iframe
				src={url}
				height={link.height}
				style={{
					border: 'none',
					width: '100%',
				}}
				title={link.name || link.url}
			/>
		</div>
	)
}
