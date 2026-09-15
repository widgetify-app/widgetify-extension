export function TodosEmpty() {
	return (
		<div className="flex flex-col items-center justify-start flex-1 px-5 gap-y-1.5">
			<div className="flex items-center justify-center w-12 h-12">
				<img
					src="https://cdn.widgetify.ir/system/no-items.png"
					alt=""
					className="object-contain w-48 h-auto select-none"
				/>
			</div>

			<p className="mt-1 font-bold text-center text-content">
				اینجا فعلا خیلی آرومه...
			</p>

			<p className="text-center text-[.65rem] leading-5 text-content opacity-75">
				هنوز هیچ تسکی نداری
				<br />
				وقتشه یه چیزی اضافه کنی، مثلا:
				<br />🛒 خرید خونه
				<br />☕ یه استراحت کوتاه
			</p>
		</div>
	)
}
