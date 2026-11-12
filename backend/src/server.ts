import 'dotenv/config'
import app from './app'
import { connectDatabase } from './services/database'

const port = Number(process.env.PORT ?? 3001)

connectDatabase()

app.listen(port, () => {
  console.log(`AI Image Scanner API listening on port ${port}`)
})
