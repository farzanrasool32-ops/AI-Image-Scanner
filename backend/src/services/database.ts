import mongoose from 'mongoose'

export function connectDatabase() {
  const uri = process.env.MONGODB_URI?.trim()
  if (!uri) {
    console.warn('MONGODB_URI is not configured; authentication endpoints are unavailable.')
    return
  }

  void mongoose.connect(uri)
    .then(() => console.info('Connected to MongoDB.'))
    .catch((error: unknown) => console.error('Could not connect to MongoDB:', error))
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1
}
