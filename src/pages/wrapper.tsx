import { Toaster } from 'react-hot-toast'
import { StoreProvider } from '../context/store.context'
import { NavbarLayout } from '../layouts/navbar/navbar.layout'

interface Props {
	children: JSX.Element
}

export function PageWrapper(props: Props) {
	return (
		<div className={'h-screen max-w-[1080px]  mx-auto px-2 md:px-0'}>
			<StoreProvider>
				<NavbarLayout />
				{props.children}
				<Toaster />
			</StoreProvider>
		</div>
	)
}
// <div className={'h-screen overflow-y-auto px-14 lg:px-0 pb-10 pt-5 xl:px-[38rem]'}>
