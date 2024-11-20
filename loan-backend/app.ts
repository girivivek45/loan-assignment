import express from 'express';
import dotenv from 'dotenv';
import user from "./routes/user"
import loanRoutes from "./routes/loanRoutes"
import cors from "cors"
import mongoose from 'mongoose';

dotenv.config();
const dbUri = process.env.MONGODB_URI;
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
      console.log('MongoDB Connected');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  };
  connectDB();
const app = express();
app.use(express.json());
app.use(cors({
    origin:["https://creditsea-rust.vercel.app","http:localhost:5173"],
    credentials:true
}))

app.get("/",async(req,res)=>{
  res.send("hello world");
})

app.use("/api",user);
app.use("/api/loans",loanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
