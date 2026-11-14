import decorationArt from '@/assets/images/christmas/logo-decoration.webp'

export function LogoDecoration() {
	return (
		<img
			src={decorationArt}
			alt=""
			aria-hidden="true"
			draggable={false}
			decoding="async"
			className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none size-[150%] pointer-events-none select-none"
		/>
	)
}
