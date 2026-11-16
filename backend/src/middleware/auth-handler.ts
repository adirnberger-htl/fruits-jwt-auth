import type {Request, Response, NextFunction} from "express";
import {StatusCodes} from "http-status-codes";
import jwt, {JwtPayload} from "jsonwebtoken";
import "dotenv/config"
import {AuthRequest} from "../types";
export const authorize = (requiredRole?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string | undefined = req.header("Authorization")?.replace("Bearer ", "");
            if(!token) throw new Error("No token provided");
            const decode: JwtPayload | string = jwt.verify(token, process.env.SECRET_KEY || "12345");
            (req as unknown as AuthRequest).payload = decode as JwtPayload;
            if(requiredRole !== undefined) {
                const payload: JwtPayload = (req as unknown as AuthRequest).payload as JwtPayload;
                if(payload.user.role !== requiredRole) {
                    return res.status(StatusCodes.FORBIDDEN).json({message: `You need ${requiredRole} status`})
                }
            }
            next();
        }catch(err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.UNAUTHORIZED).json({message: err.message});
            }
        }
    }
}