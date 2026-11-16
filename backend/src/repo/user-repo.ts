import {UserDB} from "../types";
import {DB} from "../database/db";

export class UserRepo {
    public static getAllUsers() : UserDB[] {
        const db: DB = new DB(true);
        const stmt = db.database.prepare("SELECT EMAIL AS email, PASSWORD AS password, FULL_NAME AS fullName, ROLE AS role FROM users");
        return (stmt.all() as UserDB[]) || [];
    }
}