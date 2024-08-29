import express from "express"
import authRoute from "./routes/authRoutes";
const cors = require('cors')
const dotenv = require("dotenv");
dotenv.config();
const app =  express();
app.use(express.json());
app.use(cors({
  origin:"http://localhost:5173"
}))

app.use("/auth/",authRoute);
app.get("/test/",(req,res)=>{
  res.status(200);
  res.send({
    msg: " hello from server"
  });
})

app.listen(process.env.PORT,()=>{
  console.log(`application running on port ${process.env.PORT}`)
})