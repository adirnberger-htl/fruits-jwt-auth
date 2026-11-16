import {Fruit, FruitsDB} from "../types";
import {FruitRepo} from "../repo/fruit-repo";


export class FruitService {
    public static getAllFruits() {
        const result: FruitsDB[] | undefined = FruitRepo.getAllFruits();
        return result === undefined ? [] : result;
    }
    public static createNewFruit(fruit: Fruit) {

        if(!fruit || fruit.name === undefined || Number.isNaN(Number(fruit.price)) || Number.isNaN(Number(fruit.stock))) {
            throw new Error("Invalid fruit attributes");
        }
        FruitRepo.createNewFruit(fruit);
    }
    public static deleteFruit(id :string) {
        if(Number.isNaN(Number(id))) {
            throw new Error("Invalid fruit attributes");
        }
        FruitRepo.deleteFruit(Number(id));
    }
}