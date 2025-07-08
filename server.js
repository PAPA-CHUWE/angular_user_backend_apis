import express, { json, urlencoded } from 'express';
import cors from 'cors';
import userRoutes from "./routes/UserRoute.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Route for user operations
app.use("/api/users", userRoutes);

// Health check route or API description
app.get('/api/users', (req, res) => {
  res.status(200).json({ message: '🧑‍💼 User Management API is working' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
