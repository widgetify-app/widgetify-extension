import { useEffect, useState } from 'react'
import { hasOpenModal } from '../utils/modal-open'

export function useModalOpen(): boolean {
	const [open, setOpen] = useState(() => hasOpenModal(document))

	useEffect(() => {
		const check = () => setOpen(hasOpenModal(document))
		const attributes = new MutationObserver(check)
		const portals = new MutationObserver(check)

		attributes.observe(document.body, {
			subtree: true,
			attributes: true,
			attributeFilter: ['open'],
		})
		portals.observe(document.body, { childList: true })
		check()

		return () => {
			attributes.disconnect()
			portals.disconnect()
		}
	}, [])

	return open
}
