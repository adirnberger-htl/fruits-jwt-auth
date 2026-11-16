import {DB} from "../database/db";
import {Fruit, FruitsDB} from "../types";

export class FruitRepo {
    public static getAllFruits(): FruitsDB[] | undefined {
        const db = new DB(true);
        const stmt = db.database.prepare("SELECT ID as id, NAME as name, STOCK as stock, PRICE as price FROM fruits");
        return stmt.all() as FruitsDB[];
    }
    public static createNewFruit(fruit: Fruit) {
        const db = new DB(false);
        try {
            const stmt = db.database.prepare("INSERT INTO fruits(NAME, STOCK, PRICE) VALUES(?,?,?)");
            stmt.run(fruit.name, fruit.stock, fruit.price);
            db.closeDatabase(true);
        } catch (err) {
            db.closeDatabase(false)
            throw err
        }
    }
    public static deleteFruit(id: number) {
        const db = new DB(false);
        try {
            const stmt = db.database.prepare("DELETE FROM fruits WHERE id = ?")
            stmt.run(id)
            db.closeDatabase(true);
        }catch (err) {
            db.closeDatabase(false)
            console.log(err)
            throw err
        }
    }
}