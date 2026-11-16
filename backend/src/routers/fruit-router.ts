import {Router} from "express";
import type {Request, Response} from "express";
import {authorize} from "../middleware/auth-handler";
import {FruitService} from "../services/fruit-service";
import {StatusCodes} from "http-status-codes";
import {Fruit, FruitsDB} from "../types";

export const fruitRouter = Router();

fruitRouter.get("/fruits", authorize(),(request: Request, res: Response) => {
    try {
        const result: FruitsDB[] = FruitService.getAllFruits();
        return res.status(StatusCodes.OK).json(result);
    }catch (err){
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).send();
    }
})

fruitRouter.post("/fruits", authorize("admin"),(req: Request, res: Response) => {
    try {
        FruitService.createNewFruit(req.body as Fruit);
        return res.status(StatusCodes.CREATED).send({message: "Created Fruit"});
    }catch (err){
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).send({message: "Failed to create fruit. Check attributes again"});
    }
})

fruitRouter.delete("/fruits/:id", authorize(),(req: Request, res: Response) => {
    try {
        FruitService.deleteFruit(req.params.id as string)
        return res.status(StatusCodes.OK).send({message: "Fruits deleted successfully"});
    }catch (err){
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).send();
    }
})