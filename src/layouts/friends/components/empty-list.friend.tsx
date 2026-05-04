import { FiUsers } from 'react-icons/fi'

interface Prop {
	emptyMessage?: string
}
export function FriendEmptyList({ emptyMessage }: Prop) {
	return (
		<div className="flex flex-col items-center justify-center px-6 py-12 text-center">
			<div className="relative mb-5">
				<div className="flex items-center justify-center w-16 h-16 rounded-xl bg-content">
					<FiUsers className="text-content" size={26} />
				</div>
				<div className="absolute inset-0 rounded-full bg-content blur-xl opacity-40" />
			</div>

			{emptyMessage ? (
				<p className="text-sm font-medium text-base-content/70">{emptyMessage}</p>
			) : (
				''
			)}

			<p className="mt-1 text-xs text-base-content/40">لیست خالیه!</p>
		</div>
	)
}
