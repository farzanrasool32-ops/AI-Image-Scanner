import express from 'express'
import multer from 'multer'

const maxImageSize = 12 * 1024 * 1024
const acceptedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
])

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxImageSize, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!acceptedImageTypes.has(file.mimetype)) {
      callback(new Error('Unsupported image type. Choose a JPEG, PNG, WEBP, GIF, BMP, or TIFF image.'))
      return
    }
    callback(null, true)
  },
})

export function imageUpload(fieldName: string) {
  return (request: express.Request, response: express.Response, next: express.NextFunction) => {
    upload.single(fieldName)(request, response, (error) => {
      if (error) {
        response.status(400).json({ error: error.message })
        return
      }
      next()
    })
  }
}
