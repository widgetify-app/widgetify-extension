export function NoteEmpty() {
	return (
		<div className="flex flex-col items-center h-full mt-4">
			<div className="flex items-center justify-center w-12 h-12">
				<img
					src="https://cdn.widgetify.ir/system/no-items.png"
					alt="بدون یادداشت"
					className="object-contain w-48 h-auto select-none"
				/>
			</div>

			<p className="mt-2 text-sm font-bold text-content">اینجا هنوز سفیده...</p>

			<p className="text-center text-[.65rem] leading-5 text-content opacity-75">
				اولین یادداشتت رو بنویس.
				<br />
				مثلا:
				<br />💡 ایده‌ی پروژه
				<br />🛒 لیست خرید
				<br />
				یه جمله برای خودت واسه بعدا
			</p>
		</div>
	)
}
