import { Router } from "express";
import {checkToken} from "../middlewares/checkToken";
import { jwtChecking, userLogIn,userSignUp } from "../controllers/userControllers";


const route = Router();

enum scode {
  Ok=200,
  Cbad = 400
} 

route.post('/signup',userSignUp);
route.post('/login',userLogIn)
route.get('/jwtChecking',checkToken,jwtChecking);


export default route;