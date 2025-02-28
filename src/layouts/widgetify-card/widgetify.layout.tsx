import ClockComponent from './components/clock.component'
export const WidgetifyLayout = () => {
	const random = ['گوجه', 'هندونه 🍉', 'بلبل جان', 'باهوش 🧠']

	const user = {
		name: random[Math.floor(Math.random() * random.length)],
	}
	return (
		<div className="h-full p-3 bg-neutral-900/70 backdrop-blur-sm rounded-2xl max-h-80">
			<div className="flex flex-col items-center gap-2">
				<div className="flex items-center justify-between w-full border-b border-gray-700/30">
					<p className="font-semibold text-gray-300 truncate text-md">
						سلام {user.name}، چه خبر؟
					</p>
					<ClockComponent />
				</div>
			</div>
		</div>
	)
}
