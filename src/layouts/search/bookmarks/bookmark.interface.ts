import type { LocalBookmark } from '../../../context/store.context'
import type { FetchedBookmark } from '../../../services/getMethodHooks/getBookmarks.hook'

export interface Bookmark extends LocalBookmark, FetchedBookmark {}
