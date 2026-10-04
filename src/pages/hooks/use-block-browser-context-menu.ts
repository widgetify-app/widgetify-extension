import { useEffect } from 'react'
import { blockBrowserContextMenu } from '@/pages/utils/block-browser-context-menu'

export function useBlockBrowserContextMenu() {
	useEffect(() => blockBrowserContextMenu(document), [])
}
