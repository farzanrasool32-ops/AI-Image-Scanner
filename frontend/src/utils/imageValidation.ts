const supportedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
])
const maxBytes = 12 * 1024 * 1024

export function validateImage(file: File): { valid: true } | { valid: false; message: string } {
  if (!supportedTypes.has(file.type)) {
    return { valid: false, message: 'That image format is not supported. Choose JPEG, PNG, WEBP, GIF, BMP, or TIFF.' }
  }
  if (file.size === 0) {
    return { valid: false, message: 'This image is empty. Choose another file.' }
  }
  if (file.size > maxBytes) {
    return { valid: false, message: 'This image is larger than 12 MB. Choose a smaller file.' }
  }
  return { valid: true }
}