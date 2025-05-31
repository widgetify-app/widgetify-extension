interface NewsContainerProps {
  isLoading: boolean
  isEmpty: boolean
  noFeedsConfigured: boolean
  onAddFeed: () => void
  children: React.ReactNode
  inComboWidget: boolean
}

export const NewsContainer = ({
  isLoading,
  isEmpty,
  noFeedsConfigured,
  children,
  inComboWidget,
}: NewsContainerProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="w-6 h-6 border-2 border-t-2 rounded-full animate-spin border-primary border-t-transparent"></div>
        <p className="mt-2 text-sm opacity-70">در حال دریافت اخبار...</p>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 mb-4 text-gray-400 opacity-40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="mb-2 text-sm font-medium opacity-70">
          هیچ خبری برای نمایش وجود ندارد
        </p>
        <p className="max-w-xs mb-4 text-xs opacity-50">
          {noFeedsConfigured
            ? 'لطفا یک فید RSS اضافه کنید تا اخبار مورد نظر خود را دریافت کنید'
            : 'در حال حاضر خبری از منابع شما موجود نیست'}
        </p>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col h-full gap-3 ${inComboWidget ? '' : 'overflow-y-auto'}`}
    >
      {children}
    </div>
  )
}
