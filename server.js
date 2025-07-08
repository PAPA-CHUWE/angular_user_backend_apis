import express, { json, urlencoded } from 'express'
import cors from 'cors'
import userRoutes from './routes/UserRoute.js'
import { connect } from 'mongoose'

const app = express()
const PORT = 3000

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

const MONGODB_URI =
  'mongodb+srv://tchuwe41:KXhhNOT5ryfdPrA7@cluster0.8nhcsti.mongodb.net/USERS_DB?retryWrites=true&w=majority&appName=Cluster0'
// Database connection
connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected ✅')
  })
  .catch(err => console.error('❌ MongoDB connection error:', err))

// Route for user operations
app.use('/api/users', userRoutes)

// Health check route or API description
app.get('/', (req, res) => {
  res.status(200).json({ message: '🧑‍💼 User Management API is working' })
})

app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`)
})
