export function HolidayBadge() {
	return (
		<>
			<div className="absolute px-2 py-0.5 text-xs transform rotate-45 shadow-xl text-white -right-10 w-28 top-1 bg-error/80">
				<div className="relative z-10 font-normal tracking-wide">تعطیل</div>
			</div>
			<div className="absolute w-2 h-2 rounded-full top-2 left-2 bg-error/30 animate-pulse" />
			<div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-error/20 rounded-full animate-pulse delay-300" />{' '}
		</>
	)
}
