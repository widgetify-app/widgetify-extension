import { ContextMenu } from '@/components/contextMenu.component'

interface BookmarkContextMenuProps {
  position: { x: number; y: number }
  onDelete: () => void
  onEdit: () => void
  onOpenInNewTab?: () => void
  isFolder?: boolean
  theme: string
}

export function BookmarkContextMenu({
  position,
  onDelete,
  onEdit,
  onOpenInNewTab,
  theme,
}: BookmarkContextMenuProps) {
  const getMenuItemStyle = (isDelete = false) => {
    if (isDelete) {
      switch (theme) {
        case 'light':
          return 'text-red-600 hover:text-red-700 hover:bg-red-50/80'
        case 'dark':
          return 'text-red-400 hover:text-red-300 hover:bg-red-900/30'
        default: // glass
          return 'text-red-400 hover:text-red-300 hover:bg-white/10'
      }
    }

    switch (theme) {
      case 'light':
        return 'text-blue-600 hover:text-blue-700 hover:bg-blue-50/80'
      case 'dark':
        return 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30'
      default: // glass
        return 'text-blue-400 hover:text-blue-300 hover:bg-white/10'
    }
  }

  return (
    <ContextMenu position={position}>
      {onOpenInNewTab && (
        <button
          onClick={onOpenInNewTab}
          className={`w-full px-2 py-1.5 cursor-pointer text-center rounded-md transition-colors duration-200 ${getMenuItemStyle()}`}
        >
          باز کردن در تب جدید
        </button>
      )}

      <button
        onClick={onEdit}
        className={`w-full px-2 py-1.5 cursor-pointer text-center rounded-md transition-colors duration-200 ${getMenuItemStyle()}`}
      >
        ویرایش
      </button>

      <button
        onClick={onDelete}
        className={`w-full px-2 cursor-pointer py-1.5 text-center rounded-md transition-colors duration-200 ${getMenuItemStyle(true)}`}
      >
        حذف
      </button>
    </ContextMenu>
  )
}
