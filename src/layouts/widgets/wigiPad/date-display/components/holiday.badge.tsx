export function HolidayBadge() {
	return (
		<>
			<div className="absolute px-2 py-1 text-xs transform rotate-45 shadow-xl text-error-content -right-10 w-28 top-1 bg-error">
				<div className="relative z-10 font-semibold tracking-wide">تعطیل</div>
				<div className="absolute inset-0 opacity-50 bg-error/80 blur-xs" />
			</div>
			<div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-error/5 via-transparent to-error/10" />
			<div className="absolute w-2 h-2 rounded-full top-2 left-2 bg-error/30 animate-pulse" />
			<div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-error/20 rounded-full animate-pulse delay-300" />{' '}
		</>
	)
}
