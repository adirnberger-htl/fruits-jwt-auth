import Database from "better-sqlite3"
import bcrypt from "bcrypt";
import type {UserDB, FruitsDB} from "../types";

export class DB {
    private static DB_NAME: string = "test.db";
    public database: Database.Database;
    constructor(readonly: boolean) {
        this.database = new Database(DB.DB_NAME, {
            fileMustExist: false,
        });
        this.insertSampleData()
        if(!readonly) {
            this.beginTransaction()
        }
    }

    private beginTransaction() {
        this.database.exec("begin transaction");
    }

    private commitTransaction() {
        this.database.exec("commit");
    }

    private rollbackTransaction() {
        this.database.exec("rollback");
    }

    public closeDatabase(valid: boolean) {
        if(valid) {
            this.commitTransaction()
        }else {
            this.rollbackTransaction()
        }
    }

    private insertSampleData() {
        try {
            const userTable = this.database.prepare(
                "CREATE TABLE IF NOT EXISTS users(" +
                " EMAIL TEXT PRIMARY KEY, " +
                " PASSWORD TEXT NOT NULL, " +
                " FULL_NAME TEXT NOT NULL, " +
                " ROLE TEXT NOT NULL "+
                ") strict");
            const fruitTable = this.database.prepare("CREATE TABLE IF NOT EXISTS fruits(" +
                " ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
                " NAME TEXT NOT NULL, " +
                " STOCK INTEGER NOT NULL, " +
                " PRICE REAL NOT NULL " +
                ") strict");
            userTable.run();
            fruitTable.run();

            const user: UserDB[] = [
                {
                    email: "admin@farm.at",
                    password: bcrypt.hashSync("vault2026", 10),
                    fullName: "Chief Farmer",
                    role: "admin",
                },
                {
                    email: "user@test.com",
                    password: bcrypt.hashSync("fruit123", 10),
                    fullName: "Hans Test",
                    role: "customer",
                },
            ]
            const fruits: FruitsDB[] = [
                {
                    id: 1,
                    name: "Honeycrisp Apple",
                    stock: 50,
                    price: 1.20
                },
                {
                    id: 2,
                    name: "Organic Banana",
                    stock: 200,
                    price: 0.8
                }
            ];
            const countStmtUser = this.database.prepare("SELECT COUNT(*) as count FROM users")
            const count = countStmtUser.get() as {count: number}
            if(count.count === 0) {
                user.forEach(u => {
                    const userStmt = this.database.prepare("INSERT INTO users(EMAIL, PASSWORD, FULL_NAME, ROLE) VALUES(?,?,?,?)")
                    userStmt.run(u.email, u.password, u.fullName, u.role);
                })
                fruits.forEach(f => {
                    const fruitStmt = this.database.prepare("INSERT INTO fruits(NAME, STOCK, PRICE) VALUES(?,?,?)");
                    fruitStmt.run(f.name, f.stock, f.price);
                })
            }
        }catch(err) {
            console.log(err);
        }
    }
}