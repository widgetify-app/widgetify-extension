import { Toaster } from 'react-hot-toast'
import { NavbarLayout } from '../layouts/navbar/navbar.layout'

interface Props {
	children: JSX.Element
}

export function PageWrapper(props: Props) {
	const ios =
		typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
	const paddingBottom = ios ? 'pb-25 pt-25' : 'pb-4'

	return (
		<div className={`h-screen overflow-y-auto ${paddingBottom}`}>
			{/* <userContext.Provider value={userContextValue}> */}
			<NavbarLayout />
			{props.children}
			<Toaster />
			{/* </userContext.Provider> */}
		</div>
	)
}
