import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import router from './routes/authRoutes.js';
import cors from "cors"
import cookieParser from 'cookie-parser';

const app = express();

const PORT = process.env.PORT || 8000;


//middleware 
app.use(cors()) // to allow cross-origin requests
app.use(express.json()); // for parsing JSON
app.use(cookieParser()) // for reading cookies

app.get('/', (req, res)=>{
    res.send("API is running...")
})  

app.use('/api/auth', router);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})