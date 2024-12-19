import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { searchRouter } from './routes/search.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Journey API' });
});

// Routes
app.use('/search', searchRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', message: 'API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});