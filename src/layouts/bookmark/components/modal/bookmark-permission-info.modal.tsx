import Modal from '@/components/modal'
import { Button } from '@/components/button/button'

interface BookmarkPermissionInfoModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export function BookmarkPermissionInfoModal({
    isOpen,
    onClose,
    onConfirm,
}: BookmarkPermissionInfoModalProps) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            title="دسترسی بوکمارک ها"
            direction="rtl"
            closeOnBackdropClick={true}
            className="!z-[9999]"
        >
            <div className="p-4 max-h-[80vh] overflow-y-auto">
                <article className="pb-4 border-b blog-post border-content animate-fade-in animate-slide-up">
                    {/* Type badge and title */}
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-content">
                            اجازه دسترسی به بوکمارک های مرورگر
                        </h3>
                    </div>

                    <div className="media-container">
                        <div className="my-2 overflow-hidden rounded-lg shadow-md">
                            <img
                                src="/images/bookmark-permission-alert.jpg"
                                alt="Browser permission dialog example"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mt-2">
                        <p className="leading-relaxed text-justify text-muted">
                            برای وارد کردن بوکمارک‌های مرورگر به ویجتی‌فای، بعد از تایید کردن این
                            پیام، یک پیغام به شکل زیر روی صفحه شما ظاهر می‌شود که باید روی دکمه{' '}
                            <span className="font-semibold text-content">"Allow"</span> کلیک کنید.                        </p>
                    </div>
                </article>

                {/* Actions */}
                <div className="flex gap-3 mt-2">
                    <Button
                        onClick={() => {
                            onClose()
                        }}
                        className="flex-1 px-4 py-2 text-sm font-medium transition-colors border rounded-2xl border-content text-content"
                        size="md"
                    >
                        فعلاً نه
                    </Button>
                    <Button
                        isPrimary={true}
                        size="md"
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors rounded-2xl"
                    >
                        فعال کردن اعلان‌ها
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
