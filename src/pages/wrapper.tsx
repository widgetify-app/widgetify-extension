import { Toaster } from 'react-hot-toast'
import { NavbarLayout } from '../layouts/navbar/navbar.layout'

interface Props {
	children: JSX.Element
}

export function PageWrapper(props: Props) {
	return (
		<div className={'h-screen overflow-y-auto px-20 lg:px-36  xl:px-[38rem]'}>
			{/* <userContext.Provider value={userContextValue}> */}
			<NavbarLayout />
			{props.children}
			<Toaster />
			{/* </userContext.Provider> */}
		</div>
	)
}
// <div className={'h-screen overflow-y-auto px-14 lg:px-0 pb-10 pt-5 xl:px-[38rem]'}>
