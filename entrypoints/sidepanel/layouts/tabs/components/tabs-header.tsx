import { FiPlus, FiRefreshCw } from 'react-icons/fi'

interface TabsHeaderProps {
	tabsCount: number
	onCreateTab: () => void
	onRefresh: () => void
}

export function TabsHeader({ tabsCount, onCreateTab, onRefresh }: TabsHeaderProps) {
	return (
		<div className="sticky top-0 z-10 p-4 border-b border-gray-700">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold">تب‌های عمودی</h1>
				<div className="flex gap-2">
					<button
						onClick={onCreateTab}
						className="p-2 transition-colors rounded-lg hover:bg-gray-700"
						title="تب جدید"
					>
						<FiPlus className="text-xl" />
					</button>
					<button
						onClick={onRefresh}
						className="p-2 transition-colors rounded-lg hover:bg-gray-700"
						title="بارگذاری مجدد"
					>
						<FiRefreshCw className="text-xl" />
					</button>
				</div>
			</div>
			<div className="mt-2 text-sm text-gray-400">{tabsCount} تب فعال</div>
		</div>
	)
}
