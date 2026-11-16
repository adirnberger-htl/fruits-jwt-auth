import {Router} from "express";
import type {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {AuthRequest, UserClaims, UserCredentials, UserDB} from "../types";
import {UserService} from "../services/user-service";
import jwt from "jsonwebtoken";
import "dotenv/config"
export const userRouter = Router();

userRouter.post("/login", (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const body: UserCredentials = req.body as UserCredentials;
        const user: UserDB | undefined = UserService.checkUserCredentials(body);
        if(user === undefined) {
            throw new Error();
        }
        const userClaims: UserClaims ={
            email: user.email,
            role: user.role,
            name: user.fullName
        }
        const minutes: number = 15;
        const expires = new Date(Date.now() + minutes * 60000);
        const token = jwt.sign({
            user: userClaims,
            expiresAt: expires.getTime() / 1000,
                },
                process.env.SECRET_KEY || "12345"
            );
        return res.status(StatusCodes.OK).json({
            userClaims: userClaims,
            expiresAt: expires.toLocaleTimeString(),
            accessToken: token
        });
    }  catch {
        return res.status(StatusCodes.UNAUTHORIZED).send({message: "Your user credentials are wrong"})
    }
})