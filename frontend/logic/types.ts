import {JwtPayload} from "jsonwebtoken";

export type UserDB = {
    email: string;
    password: string;
    fullName: string;
    role: string;
}

export type FruitsDB = {
    id: number;
    name: string;
    stock: number;
    price: number;
}
export type Fruit = {
    name: string;
    stock: number;
    price: number;
}
export type UserCredentials = {
    email: string;
    password: string;
}

export type UserClaims = {
    email: string;
    role: string;
    name: string;
}

export interface AuthRequest extends Request {
    payload: JwtPayload;
}