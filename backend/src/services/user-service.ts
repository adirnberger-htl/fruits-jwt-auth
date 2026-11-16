import {UserCredentials, UserDB} from "../types";
import {UserRepo} from "../repo/user-repo";
import bcrypt from "bcrypt";
export class UserService {
    public static checkUserCredentials(user: UserCredentials) : UserDB |undefined{
        try {
            console.log(user)
            if(user.email === undefined || user.password === undefined) throw new Error("Invalid email or password");
            const users: UserDB[] = UserRepo.getAllUsers();
            const realUser: UserDB | undefined = users.find(x => x.email === user.email);
            if (realUser === undefined) {
                throw new Error("User not found");
            }
            if(bcrypt.compareSync(user.password, realUser.password)) {
                return realUser;
            }
        }catch(err) {
            console.error(err);
            throw new Error("User credentials not found");

        }
    }
}