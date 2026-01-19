import express from 'express'
import cors from 'cors'
import connectDB from './Config/db.js';
import 'dotenv/config';


const app=express();

app.use(cors())
app.use(express.json())

await connectDB()

app.get('/',(req,res)=>{
    res.send("Hello World")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});