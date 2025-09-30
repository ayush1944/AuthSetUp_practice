import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import authRoute from './routes/authRoutes.js';
import cors from "cors"
import cookieParser from 'cookie-parser';
import googleRouter from './routes/googleRoutes.js';

const app = express();

const PORT = 3000;


//middleware 
app.use(cors(
    { origin: process.env.FRONTEND_URL, credentials: true }
)) // to allow cross-origin requests
app.use(express.json()); // for parsing JSON
app.use(cookieParser()) // for reading cookies

app.get('/', (req, res)=>{
    res.send("API is running...")
})  

app.use('/api/auth', authRoute);
app.use('/api/auth', googleRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})