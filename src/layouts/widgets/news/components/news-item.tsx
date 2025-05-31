import moment from 'jalali-moment'

interface NewsItemProps {
  title: string
  description?: string
  source: {
    name: string
    url: string
  }
  publishedAt: string
  link?: string
  index: number
  onClick: (url: string) => void
}

export const NewsItem = ({
  title,
  description,
  source,
  publishedAt,
  link,
  onClick,
}: NewsItemProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return moment(date).locale('fa').format('HH:mm - jYYYY/jMM/jDD')
    } catch (e) {
      return dateString
    }
  }

  const handleClick = () => {
    const url = link || source.url
    if (url && typeof url === 'string') onClick(url)
  }

  return (
    <div className="transition-all">
      <div
        className="p-2 rounded-lg cursor-pointer hover:bg-opacity-50 hover:bg-gray-500/10"
        onClick={handleClick}
      >
        <div className="flex items-start gap-2">
          <h3 className="flex-1 text-sm font-medium">{title}</h3>
        </div>
        {description && (
          <p className="mt-1 text-xs font-light line-clamp-2 opacity-80">
            {description.replace(/\n/g, ' ').replace(/<.*?>/g, '')}
          </p>
        )}
        <div className="flex items-center justify-between mt-1 text-xs opacity-60">
          <span className="px-2 py-0.5 text-xs rounded-full bg-primary/15 text-primary flex-shrink-0 max-w-[100px] truncate">
            {source.name}
          </span>
          <span dir="ltr" className="flex items-center gap-1">
            {formatDate(publishedAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
