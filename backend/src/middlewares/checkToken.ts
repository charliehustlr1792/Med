import { Request, Response, NextFunction, request } from "express";
const jwt = require("jsonwebtoken");

interface newReq extends Request{
  userId?:string
}
const checkToken = async (req:newReq,res:Response,next:NextFunction)=>{
  try {
    const decoded = jwt.verify(req.headers.authorization,process.env.JWTSECRET);
    req.userId = decoded.userName;
    next();
  }
  catch(err){
    res.status(404);
    res.send(
      {
        msg:"accessDenied"
      }
    )
  }
}
export {checkToken,newReq};