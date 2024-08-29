import { Router } from "express";
import { Request, Response } from "express";
import pclient from "../client";
import {checkToken} from "../middlewares/checkToken";
const  bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");


const route = Router();
enum scode {
  Ok=200,
  Cbad = 400
} 

const userSignUp = async (req: Request, res: Response) => {
  pclient.user.findMany({
    where: {
      OR: [
        {
          email: req.body.email
        },
        {
          uname: req.body.uname
        }
      ]
    }
  }).then( async (data) => {
    if (data.length != 0) {
      data.forEach(e => {
        res.status(400);
        if (e.email === req.body.email) {
          res.send({
            msg: "emailExist"
          });
        }
        else if (e.uname === req.body.uname) {
          res.send({
            msg: "userExist"
          });
        }
      });
    }
    else {
      //no user present like that
      const hashed = await bcrypt.hash(req.body.password,10);
      pclient.user.create(
        {
          data: {
            email: req.body.email,
            uname: req.body.uname,
            password: hashed,
          }
        }
      ).then(data => {
        res.status(200);
        res.send({
          msg: "userCreated"
        });
      }).catch(e => {
        console.log("error : \n", e);
        res.status(500);
        res.send();
      })
    }
  }).catch(e => {
    console.log("error : \n", e);
    res.status(500);
    res.send();
  })
};


const userLogIn = async (req:Request, res:Response) => {
  pclient.user.findUnique({
    where: {
      email:req.body.email,
    }
  }).then(async data => {
    if (data == null) {
      res.status(400);
      res.send({ msg: "userNotFound" })
    }
    else {
      const comp = await bcrypt.compare(req.body.password,data.password);
      if(!comp) {
        res.status(404).json({
          msg:"incorrectPassword"
        });
      }
      try{
        jwt.sign({
          userName : data.uname,
          rand : Math.random()
        }, process.env.JWTSECRET, (err: any, token: any) => {
          if (err) {
            res.status(500);
            res.send({
              msg: "tokenGenerationFailed"
            });
            console.log(err);
          }
          else {
            res.status(200);
            res.send({
              msg: "loginSuccesfull",
              jwtToken: token
            });
          }
        })
      }
      catch(err){
        console.log(err);
        res.status(500)
        res.send({
          msg:"serverIssue"
        });
      }
    }
  }).catch(err=>{
    console.log("error : \n", err);
    res.status(500);
    res.send();
  })
}




const jwtChecking = (req: Request,res:Response)=>{
  res.status(200).json({
    msg:"jwt working fine"
  });
}


export {userLogIn,userSignUp,jwtChecking};