import { CurrencyProvider } from '@/context/currency.context'
import { DateProvider } from '@/context/date.context'
import { TodoProvider } from '@/context/todo.context'
import { BookmarksList } from '@/layouts/bookmark/bookmarks'
import { BookmarkProvider } from '@/layouts/bookmark/context/bookmark.context'
import { SearchLayout } from '@/layouts/search/search'
import { SimpleTools } from '@/layouts/simplify/tools-simplify'
import { SimplifyYadkar } from '@/layouts/simplify/wigipad-simplify'
import { AnimatePresence, motion } from 'framer-motion'
export function HomeContentSimplify() {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{
					duration: 0.15,
					ease: 'linear',
				}}
				className="flex w-full flex-1 md:h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none"
			>
				<div className="flex flex-col justify-start w-full min-h-full px-1 py-1 md:px-4 md:justify-center">
					<div className="w-full mx-auto mb-4 sm:w-3/4 md:w-1/2">
						<SearchLayout />
					</div>

					<div className="flex flex-col md:flex-row w-full md:h-[calc(100%-8.5rem)] items-stretch md:items-end gap-2 justify-between">
						<div className="w-full md:w-1/4 rounded-2xl">
							<DateProvider>
								<CurrencyProvider>
									<SimpleTools />
								</CurrencyProvider>
							</DateProvider>
						</div>
						<div className="w-full md:w-[30rem] rounded-2xl flex-1">
							<BookmarkProvider>
								<BookmarksList />
							</BookmarkProvider>
						</div>

						<div className="w-full md:w-1/4 rounded-2xl">
							<DateProvider>
								<TodoProvider>
									<SimplifyYadkar />
								</TodoProvider>
							</DateProvider>
						</div>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	)
}
