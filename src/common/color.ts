export async function getMainColorFromImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = src
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Could not get 2D context from canvas')
      }
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const data = ctx.getImageData(0, 0, img.width, img.height).data
      const rgb = [0, 0, 0]
      for (let i = 0; i < data.length; i += 4) {
        rgb[0] += data[i]
        rgb[1] += data[i + 1]
        rgb[2] += data[i + 2]
      }

      rgb[0] = Math.round(rgb[0] / (data.length / 4))
      rgb[1] = Math.round(rgb[1] / (data.length / 4))
      rgb[2] = Math.round(rgb[2] / (data.length / 4))

      const hex = `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1).toUpperCase()}`
      resolve(hex)
    }
    img.onerror = (err) => reject(err)
  })
}

export const addOpacityToColor = (color: string, opacity: number): string => {
  if (color.startsWith('rgba')) {
    return color.replace(/rgba\((.+?),\s*[\d.]+\)/, `rgba($1, ${opacity})`)
  }

  if (color.startsWith('rgb(')) {
    const rgb = color.match(/rgb\((.+?)\)/)?.[1]
    return rgb ? `rgba(${rgb}, ${opacity})` : color
  }

  const tempDiv = document.createElement('div')
  tempDiv.style.color = color
  document.body.appendChild(tempDiv)
  const computedColor = window.getComputedStyle(tempDiv).color
  document.body.removeChild(tempDiv)

  const rgbMatch = computedColor.match(/rgb\((.+?)\)/)
  return rgbMatch
    ? `rgba(${rgbMatch[1]}, ${opacity})`
    : `${color}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0')}`
}
