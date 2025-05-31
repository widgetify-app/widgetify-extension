export const getFaviconFromUrl = (url: string): string => {
  try {
    if (!url.trim()) {
      return ''
    }

    let processedUrl = url
    if (
      !processedUrl.startsWith('http://') &&
      !processedUrl.startsWith('https://')
    ) {
      processedUrl = `https://${processedUrl}`
    }

    const urlObj = new URL(processedUrl)
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`
  } catch {
    return ''
  }
}
