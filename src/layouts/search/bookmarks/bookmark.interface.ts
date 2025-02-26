import type { LocalBookmark } from '../../../context/bookmark.context'
import type { FetchedBookmark } from '../../../services/getMethodHooks/getBookmarks.hook'

export interface Bookmark extends LocalBookmark, FetchedBookmark {}
