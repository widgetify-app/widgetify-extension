export interface RssFeed {
  id: string
  name: string
  url: string
  enabled: boolean
}

export interface RssItem {
  title: string
  description: string
  link: string
  pubDate: string
  source: {
    name: string
    url: string
  }
}

export interface RssNewsState {
  customFeeds: RssFeed[]
  useDefaultNews: boolean
  lastFetchedItems: Record<string, RssItem[]>
}
